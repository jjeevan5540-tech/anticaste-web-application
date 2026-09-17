package com.anticaste.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.anticaste.ui.theme.antiCasteColors

data class Slogan(
    val quote: String,
    val author: String,
    val source: String? = null
)

@Composable
fun SloganCard(
    slogan: Slogan,
    modifier: Modifier = Modifier
) {
    val colors = MaterialTheme.antiCasteColors

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(colors.quoteCard)
            .padding(24.dp)
    ) {
        Text(
            text = "\u201C${slogan.quote}\u201D",
            style = MaterialTheme.typography.bodyLarge,
            fontStyle = FontStyle.Italic,
            lineHeight = 24.sp,
            color = MaterialTheme.colorScheme.onSurface
        )

        Spacer(modifier = Modifier.height(12.dp))

        Text(
            text = "\u2014 ${slogan.author}",
            style = MaterialTheme.typography.labelLarge,
            color = MaterialTheme.colorScheme.primary
        )

        slogan.source?.let { src ->
            Text(
                text = src,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
