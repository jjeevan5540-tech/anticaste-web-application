package com.anticaste.data

import com.anticaste.ui.components.Slogan

object SlogansData {

    val foundation = Slogan(
        quote = "ALL ARE EQUAL \u2014 Liberty \u2022 Equality \u2022 Fraternity",
        author = "Constitution of India",
        source = "Preamble"
    )

    val ambedkar = Slogan(
        quote = "Fraternity is only another name for democracy. Democracy is not merely a form of government; it is primarily a mode of associated living, of conjoint communicated experience.",
        author = "Dr. B.R. Ambedkar",
        source = "Annihilation of Caste, 1936"
    )

    val phule = Slogan(
        quote = "Without knowledge, intellect perished; without intellect, morality decayed; without morality, progress was lost. Truth alone triumphs over artificial caste hierarchies.",
        author = "Mahatma Jyotirao & Savitribai Phule",
        source = "Satsar, 1885"
    )

    val buddha = Slogan(
        quote = "Not by birth does one become an outcast, not by birth does one become a noble person; by deeds alone does one become an outcast, by deeds alone does one become a noble person.",
        author = "Gautama Buddha",
        source = "Vasala Sutta"
    )

    val all: List<Slogan> = listOf(foundation, ambedkar, phule, buddha)
}
