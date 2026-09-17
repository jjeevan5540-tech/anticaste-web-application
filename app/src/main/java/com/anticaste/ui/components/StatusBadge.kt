package com.anticaste.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.anticaste.ui.theme.AntiCasteColors
import com.anticaste.ui.theme.antiCasteColors

enum class ContentStatus {
    PENDING, PUBLISHED, REJECTED
}

@Composable
fun StatusBadge(
    status: ContentStatus,
    modifier: Modifier = Modifier
) {
    val colors = MaterialTheme.antiCasteColors

    val (bgColor, fgColor, label) = when (status) {
        ContentStatus.PENDING -> Triple(
            colors.statusPendingBg,
            colors.statusPending,
            "Pending"
        )
        ContentStatus.PUBLISHED -> Triple(
            colors.statusPublishedBg,
            colors.statusPublished,
            "Published"
        )
        ContentStatus.REJECTED -> Triple(
            colors.statusRejectedBg,
            colors.statusRejected,
            "Rejected"
        )
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(12.dp))
            .background(bgColor)
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = fgColor
        )
    }
}
