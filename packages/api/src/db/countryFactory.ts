import { Country } from '../rooms/schema/entities/CountryState'
import { Translation } from '../rooms/schema/entities/TranslationState'

export const countryFactory = (data: Partial<Country>) => {
  const country = new Country({
    id: data.id,
    name: data.name,
    alpha2code: data.alpha2code,
    alpha3code: data.alpha3code,
    capital: data.capital,
    region: data.region,
    subregion: data.subregion,
    population: data.population,
    area: data.area,
    topleveldomain: data.topleveldomain,
    // TODO: add correct typing once country is finalized.
    translatedcapitals: (data as any).translated_capitals,
    lat: data.lat,
    lng: data.lng,
    borders: data.borders,
    shape: data.shape,
  })

  for (const languageCode in data.translations) {
    const translation = new Translation()
    translation.capital = data.capital
    translation.country = data.translations[languageCode]
    country.translations.set(languageCode, translation)
  }

  return country
}
