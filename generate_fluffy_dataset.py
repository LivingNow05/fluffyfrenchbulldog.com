import csv

input_file = '/Users/anthony/Downloads/Bulldog Fluffy/dataset_enriched_stories.csv'
output_file = '/Users/anthony/Downloads/Bulldog Fluffy/dataset_fluffy_stories.csv'

def extract_city(h1_title):
    title = h1_title
    for prefix in ["Maine Coon en ", "Maine Coon no ", "Maine Coon em ", "Maine Coon "]:
        if title.startswith(prefix):
            title = title[len(prefix):]
            break
    return title.strip()

def build_fluffy_row(row, index):
    domain = "http://dinastiabulldogfluffy.com"
    category = row["Categoría"]
    
    orig_slug = row["URL Final (Slug)"]
    new_slug = orig_slug.replace("maine-coon-", "bulldog-frances-fluffy-")
    
    orig_h1 = row["H1 Título"]
    country = row["País"]
    city = extract_city(orig_h1)
    
    if country == "Brasil":
        new_h1 = orig_h1.replace("Maine Coon", "Bulldog Francês Fluffy")
    else:
        new_h1 = orig_h1.replace("Maine Coon", "Bulldog Francés Fluffy")
        
    airport = row["Aeropuerto"]
    currency = row["Moneda"]
    
    # Meta description
    if index % 2 == 0:
        meta_desc = f"Venta de cachorros Bulldog Francés Fluffy en {city}. Criadero especializado con pelaje largo (gen L4/L1), pedigree de pureza y garantía de salud."
    else:
        meta_desc = f"Encuentra cachorros Bulldog Francés Fluffy en {city}. Ejemplares puros de lujo con pelo sedoso (gen L4/L1), pedigree oficial y envíos seguros."

    # Historia Local custom per city and country (all in Spanish for consistency with source dataset)
    template_type = index % 3
    
    if template_type == 0:
        story = (
            f"El Bulldog Francés Fluffy ha conquistado los corazones de las familias en {city}, {country}. "
            f"Esta codiciada variante destaca por su pelaje abundante y sedoso, resultado de la exclusiva genética de pelo largo (gen L4/L1), "
            f"así como por su carácter profundamente cariñoso, dócil y leal. "
            f"Gracias a su tamaño compacto y temperamento equilibrado, posee una adaptabilidad perfecta tanto a la vida en apartamento como al clima de {city}. "
            f"Cada cachorro viaja bajo estrictos protocolos de bienestar animal garantizando su llegada segura a través del {airport}. "
            f"Para tu absoluta tranquilidad, entregamos a tu nuevo integrante con su esquema completo de vacunas al día, desparasitación y su certificado genético con pedigree que acredita su pureza de raza."
        )
    elif template_type == 1:
        story = (
            f"Darle la bienvenida a un Bulldog Francés Fluffy en {city} es una experiencia de verdadero lujo para cualquier hogar en {country}. "
            f"Con su deslumbrante pelaje abundante y sedoso derivado de la portación del gen L4/L1 y un carácter dócil, juguetón y cariñoso, "
            f"esta maravillosa raza se convierte en el compañero fiel ideal. "
            f"Su excelente adaptabilidad a la convivencia en apartamento y su fácil climatización en {city} aseguran su máximo confort diario. "
            f"Nuestro protocolo VIP garantiza un envío coordinado y su llegada segura a través del {airport}, "
            f"entregando cada ejemplar con su certificado genético de pureza de sangre, pedigree oficial y todas sus vacunas al día."
        )
    else:
        story = (
            f"Para quienes buscan la máxima distinción y ternura en {city}, {country}, el Bulldog Francés Fluffy es el compañero soñado. "
            f"Su singular manto de pelaje abundante y sedoso, respaldado genéticamente por la variante del gen L4/L1, "
            f"combinado con su temperamento dócil, amigable y sumamente cariñoso, enamora desde el primer instante. "
            f"Su extraordinaria adaptabilidad a espacios urbanos como apartamentos y a la atmósfera de {city} garantiza una convivencia llena de armonía. "
            f"Organizamos un traslado de primera clase con llegada segura al {airport}, "
            f"respaldando la salud de tu mascota con esquema de vacunas al día, desparasitación completa y su certificado genético junto a su pedigree de pureza."
        )

    return {
        "Dominio": domain,
        "Categoría": category,
        "URL Final (Slug)": new_slug,
        "H1 Título": new_h1,
        "Meta Descripción": meta_desc,
        "Moneda": currency,
        "País": country,
        "Aeropuerto": airport,
        "Historia Local": story
    }

def main():
    with open(input_file, mode='r', encoding='utf-8') as f:
        reader = list(csv.DictReader(f))
    
    fieldnames = ['Dominio', 'Categoría', 'URL Final (Slug)', 'H1 Título', 'Meta Descripción', 'Moneda', 'País', 'Aeropuerto', 'Historia Local']
    
    out_rows = []
    for idx, row in enumerate(reader):
        fluffy_row = build_fluffy_row(row, idx)
        out_rows.append(fluffy_row)
        
    with open(output_file, mode='w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, quoting=csv.QUOTE_MINIMAL)
        writer.writeheader()
        writer.writerows(out_rows)
        
    print(f"Generated {len(out_rows)} rows in {output_file}")

if __name__ == "__main__":
    main()
