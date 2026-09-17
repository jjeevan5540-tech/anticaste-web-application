package com.anticaste.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary            = Terracotta500,
    onPrimary          = FgOnBg.OnPrimary,
    primaryContainer   = Terracotta100,
    onPrimaryContainer = FgOnBg.OnPrimaryCont,

    secondary          = Indigo600,
    onSecondary        = Color(0xFFFFFFFF),
    secondaryContainer = Indigo100,
    onSecondaryContainer = FgOnBg.OnSecondaryCont,

    tertiary           = Gold500,
    onTertiary         = Color(0xFFFFFFFF),
    tertiaryContainer  = Gold100,
    onTertiaryContainer = Color(0xFF78350F),

    background         = WarmSand,
    onBackground       = FgOnBg.OnSurface,

    surface            = SurfaceLight,
    onSurface          = FgOnBg.OnSurface,
    surfaceVariant     = SurfaceVarLight,
    onSurfaceVariant   = FgOnBg.OnSurfaceVar,

    outline            = OutlineLight,
    outlineVariant     = Color(0xFFD6D3D1),

    error              = StatusRejected,
    onError            = Color(0xFFFFFFFF),
    errorContainer     = StatusRejectedBg,
    onErrorContainer   = Color(0xFF991B1B),
)

private val DarkColorScheme = darkColorScheme(
    primary            = Terracotta700,
    onPrimary          = Color(0xFFFFFFFF),
    primaryContainer   = Terracotta800,
    onPrimaryContainer = FgOnBg.OnPrimaryContDark,

    secondary          = Indigo800,
    onSecondary        = Color(0xFFFFFFFF),
    secondaryContainer = Indigo900,
    onSecondaryContainer = FgOnBg.OnSecondaryContDark,

    tertiary           = Gold500,
    onTertiary         = Color(0xFF000000),
    tertiaryContainer  = Gold800,
    onTertiaryContainer = Color(0xFFFEF3C7),

    background         = DarkBG,
    onBackground       = FgOnBg.OnSurfaceDark,

    surface            = DarkSurface,
    onSurface          = FgOnBg.OnSurfaceDark,
    surfaceVariant     = DarkSurfaceVar,
    onSurfaceVariant   = FgOnBg.OnSurfaceVarDark,

    outline            = OutlineDark,
    outlineVariant     = Color(0xFF44403C),

    error              = StatusRejected,
    onError            = Color(0xFFFFFFFF),
    errorContainer     = Color(0xFF7F1D1D),
    onErrorContainer   = StatusRejectedBg,
)

@Composable
fun AntiCasteTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = AntiCasteTypography,
        shapes = AntiCasteShapes,
        content = content
    )
}
