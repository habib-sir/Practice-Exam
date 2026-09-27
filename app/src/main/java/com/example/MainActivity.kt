package com.example

import android.annotation.SuppressLint
import android.content.Intent
import android.media.AudioManager
import android.media.ToneGenerator
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.ViewGroup
import android.webkit.JavascriptInterface
import android.webkit.RenderProcessGoneDetail
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView

class MainActivity : ComponentActivity() {

    private var webView: WebView? = null
    private var toneGen: ToneGenerator? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        try {
            toneGen = ToneGenerator(AudioManager.STREAM_NOTIFICATION, 80)
        } catch (_: Exception) {
            toneGen = null
        }
        setContent {
            AppScreen(
                activity = this,
                onWebViewCreated = { webView = it },
                vibrateDevice = { vibrateDevice() },
                playBeepSound = { playBeepSound() }
            )
        }
    }

    private fun vibrateDevice() {
        val vibrator = getSystemService(Vibrator::class.java)
        vibrator?.let {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                it.vibrate(VibrationEffect.createOneShot(100, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                it.vibrate(100)
            }
        }
    }

    private fun playBeepSound() {
        try {
            toneGen?.startTone(ToneGenerator.TONE_PROP_BEEP, 200)
        } catch (_: Exception) {
        }
    }

    override fun onResume() {
        super.onResume()
        webView?.onResume()
    }

    override fun onPause() {
        webView?.onPause()
        super.onPause()
    }

    override fun onDestroy() {
        toneGen?.release()
        toneGen = null
        webView?.destroy()
        webView = null
        super.onDestroy()
    }
}

class WebAppInterface(
    private val activity: MainActivity,
    private val onVibrate: () -> Unit,
    private val onBeep: () -> Unit
) {
    @JavascriptInterface
    fun vibrate() {
        activity.runOnUiThread {
            onVibrate()
        }
    }

    @JavascriptInterface
    fun playBeep() {
        activity.runOnUiThread {
            onBeep()
        }
    }

    @JavascriptInterface
    fun getBuildConfigApiKey(): String {
        return try {
            val field = BuildConfig::class.java.getField("GEMINI_API_KEY")
            val key = field.get(null) as? String ?: ""
            if (key == "MY_GEMINI_API_KEY") "" else key
        } catch (_: Exception) {
            ""
        }
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun AppScreen(
    activity: MainActivity,
    onWebViewCreated: (WebView) -> Unit,
    vibrateDevice: () -> Unit,
    playBeepSound: () -> Unit
) {
    var activeWebView: WebView? = null

    BackHandler {
        if (activeWebView?.canGoBack() == true) {
            activeWebView?.goBack()
        }
    }

    AndroidView(
        modifier = Modifier
            .fillMaxSize()
            .systemBarsPadding(),
        factory = { context ->
            WebView(context).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
                settings.apply {
                    javaScriptEnabled = true
                    domStorageEnabled = true
                    allowFileAccess = true
                    mediaPlaybackRequiresUserGesture = false
                    cacheMode = WebSettings.LOAD_DEFAULT
                    useWideViewPort = true
                    loadWithOverviewMode = true
                }
                webChromeClient = object : WebChromeClient() {
                    override fun onConsoleMessage(consoleMessage: android.webkit.ConsoleMessage?): Boolean {
                        android.util.Log.d(
                            "StudyMasterConsole",
                            "[${consoleMessage?.messageLevel()}] ${consoleMessage?.message()} (${consoleMessage?.sourceId()}:${consoleMessage?.lineNumber()})"
                        )
                        return super.onConsoleMessage(consoleMessage)
                    }
                }
                webViewClient = object : WebViewClient() {
                    override fun onRenderProcessGone(view: WebView?, detail: RenderProcessGoneDetail?): Boolean {
                        android.util.Log.w("StudyMaster", "Render process gone (didCrash=${detail?.didCrash()})")
                        return true
                    }

                    override fun onReceivedError(
                        view: WebView?,
                        request: WebResourceRequest?,
                        error: WebResourceError?
                    ) {
                        super.onReceivedError(view, request, error)
                        android.util.Log.w("StudyMaster", "WebView error: ${error?.description}")
                    }

                    override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                        url?.let {
                            if (it.startsWith("file:///android_asset/")) {
                                return false
                            }
                            try {
                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(it))
                                context.startActivity(intent)
                                return true
                            } catch (_: Exception) {
                                return false
                            }
                        }
                        return false
                    }
                }
                addJavascriptInterface(WebAppInterface(activity, vibrateDevice, playBeepSound), "AndroidBridge")
                loadUrl("file:///android_asset/index.html")
                activeWebView = this
                onWebViewCreated(this)
            }
        }
    )
}
