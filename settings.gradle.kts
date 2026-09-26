pluginManagement {
  repositories {
    google {
      content {
        includeGroupByRegex("com\\.android.*")
        includeGroupByRegex("com\\.google.*")
        includeGroupByRegex("androidx.*")
      }
    }
    mavenCentral()
    gradlePluginPortal()
  }
}

plugins { id("org.gradle.toolchains.foojay-resolver-convention") version "1.0.0" }

dependencyResolutionManagement {
  repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
  repositories {
    google()
    mavenCentral()
  }
}

rootProject.name = "Study Master"

// Ensure debug.keystore is restored from debug.keystore.base64 on any build (e.g. after git export)
val ksFile = file("debug.keystore")
val ksB64File = file("debug.keystore.base64")
if (!ksFile.exists() && ksB64File.exists()) {
  try {
    val bytes = java.util.Base64.getDecoder().decode(ksB64File.readText().trim())
    ksFile.writeBytes(bytes)
  } catch (_: Exception) {}
}

include(":app")
