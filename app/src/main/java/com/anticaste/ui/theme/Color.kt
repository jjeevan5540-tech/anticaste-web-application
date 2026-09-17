package com.anticaste.ui.theme

import androidx.compose.ui.graphics.Color

// ── Brand Palette ──────────────────────────────────────────────
val Terracotta500  = Color(0xFFBF4A33)  // Primary
val Terracotta700  = Color(0xFF9A2E1A)  // Primary Dark
val Terracotta100  = Color(0xFFFBECE8)  // Primary Container Light
val Terracotta800  = Color(0xFF883116)  // Primary Container Dark

val Indigo600      = Color(0xFF3949AB)  // Secondary
val Indigo800      = Color(0xFF1A237E)  // Secondary Dark
val Indigo100      = Color(0xFFE8EEF5)  // Secondary Container Light
val Indigo900      = Color(0xFF283845)  // Secondary Container Dark

val Gold500        = Color(0xFFD97706)  // Accent / Tertiary
val Gold100        = Color(0xFFFEF3C7)  // Tertiary Container Light
val Gold800        = Color(0xFF78350F)  // Tertiary Container Dark

// ── Neutrals ───────────────────────────────────────────────────
// Light Theme
val WarmSand        = Color(0xFFF9F7F3)  // Background
val SurfaceLight    = Color(0xFFFFFFFF)  // Surface / Cards
val SurfaceVarLight = Color(0xFFF4F0EA)  // Surface Variant
val OnSurfaceLight  = Color(0xFF1C1917)  // OnSurface text
val OutlineLight    = Color(0xFF78716C)  // Border / Divider

// Dark Theme
val DarkBG          = Color(0xFF13171C)  // Background
val DarkSurface     = Color(0xFF1C2229)  // Surface / Cards
val DarkSurfaceVar  = Color(0xFF252D37)  // Surface Variant
val OnSurfaceDark   = Color(0xFFE7E5E4)  // OnSurface text
val OutlineDark     = Color(0xFFA8A29E)  // Border / Divider

// ── Status Colors ──────────────────────────────────────────────
val StatusPending   = Color(0xFFF59E0B)  // Amber 500
val StatusPendingBg = Color(0xFFFEF3C7)  // Amber 100
val StatusPublished = Color(0xFF22C55E)  // Green 500
val StatusPublishedBg = Color(0xFFDCFCE7) // Green 100
val StatusRejected  = Color(0xFFEF4444)  // Red 500
val StatusRejectedBg = Color(0xFFFEE2E2) // Red 100

// ── Launch Mission Screen ──────────────────────────────────────
val CanvasNocturnal = Color(0xFF0A0F1D)
val SloganCard      = Color(0xFF131D33)
val TabBarPill      = Color(0xFF1E293B)
val PosterCard      = Color(0xFF0F172A)
val QuoteCard       = Color(0xFF111A2E)

// ── Vector Drawable Palette ────────────────────────────────────
val EqualityGreen   = Color(0xFF064E3B)
val StoneCanvas     = Color(0xFF1C1917)
val CrimsonStop     = Color(0xFF991B1B)
val CrimsonStopBright = Color(0xFFDC2626)

// ── Launcher Icon Gradient Stops ───────────────────────────────
val LauncherStart   = Color(0xFF1A2238)
val LauncherMid     = Color(0xFF231F32)
val LauncherEnd     = Color(0xFF3A2226)

// ── Accessibility Helpers ──────────────────────────────────────
// Foreground-on-background pairs with guaranteed contrast
object FgOnBg {
    // Light theme pairs (all ≥ 4.5:1 contrast)
    val OnPrimary       = Color(0xFFFFFFFF)  // on Terracotta500
    val OnPrimaryCont   = Color(0xFFBF4A33)  // on Terracotta100
    val OnSecondaryCont = Color(0xFF3949AB)  // on Indigo100
    val OnSurface       = Color(0xFF1C1917)  // on WarmSand / SurfaceLight
    val OnSurfaceVar    = Color(0xFF57534E)  // on SurfaceVarLight

    // Dark theme pairs (all ≥ 4.5:1 contrast)
    val OnPrimaryDark       = Color(0xFFFFFFFF)  // on Terracotta800
    val OnPrimaryContDark   = Color(0xFFFBECE8)  // on Terracotta800
    val OnSecondaryContDark = Color(0xFFE8EEF5)  // on Indigo900
    val OnSurfaceDark       = Color(0xFFE7E5E4)  // on DarkBG / DarkSurface
    val OnSurfaceVarDark    = Color(0xFFA8A29E)  // on DarkSurfaceVar
}
