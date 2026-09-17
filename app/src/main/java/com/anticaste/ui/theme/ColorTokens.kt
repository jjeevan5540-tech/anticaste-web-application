package com.anticaste.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

@Immutable
data class AntiCasteColors(
    // Status
    val statusPending: Color = StatusPending,
    val statusPendingBg: Color = StatusPendingBg,
    val statusPublished: Color = StatusPublished,
    val statusPublishedBg: Color = StatusPublishedBg,
    val statusRejected: Color = StatusRejected,
    val statusRejectedBg: Color = StatusRejectedBg,

    // Launch Mission
    val canvasNocturnal: Color = CanvasNocturnal,
    val sloganCard: Color = SloganCard,
    val tabBarPill: Color = TabBarPill,
    val posterCard: Color = PosterCard,
    val quoteCard: Color = QuoteCard,

    // Brand
    val terracotta: Color = Terracotta500,
    val indigo: Color = Indigo600,
    val gold: Color = Gold500,
)

val LocalAntiCasteColors = staticCompositionLocalOf { AntiCasteColors() }

object AntiCasteColorTokens {
    val colors: AntiCasteColors
        @Composable get() = LocalAntiCasteColors.current
}

// Extension for quick access in composables
val MaterialTheme.antiCasteColors: AntiCasteColors
    @Composable get() = AntiCasteColorTokens.colors
