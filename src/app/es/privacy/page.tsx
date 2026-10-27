import type { Metadata } from 'next'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { alternates } from '@/lib/i18n'

// Translation of src/app/(en)/privacy/page.tsx. Keep the two in sync: any change to
// the English policy needs the same change here (and the same "last updated" date).
export const metadata: Metadata = {
  title: 'Política de privacidad - JisokuDict',
  description: 'Política de privacidad de la app de diccionario de japonés JisokuDict y del servicio de soporte de JisokuDict.',
  alternates: alternates('es', '/privacy'),
}

const linkClass = 'text-sakura-600 hover:text-sakura-700 underline'

export default function PoliticaDePrivacidadPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="privacy" locale="es" translatedPath="/privacy" />

      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 prose prose-ink">
          <h1 className="text-4xl font-bold text-ink-900 mb-2">Política de privacidad</h1>
          <p className="text-ink-500 mb-8">Última actualización: octubre de 2026</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Introducción</h2>
            <p className="text-ink-600 mb-4">
              JisokuDict (&quot;la App&quot;) es una aplicación de diccionario japonés-inglés. Esta Política de privacidad explica cómo recopilamos, usamos y protegemos tu información cuando usas la App o el servicio de soporte de JisokuDict en jisoku.app/support.
            </p>
            <p className="text-ink-600">
              Nos comprometemos a proteger tu privacidad y a ser transparentes sobre nuestras prácticas de datos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Información que recopilamos</h2>

            <h3 className="text-xl font-semibold text-ink-800 mb-3">Datos locales (almacenados en tu dispositivo)</h3>
            <p className="text-ink-600 mb-4">La App almacena los siguientes datos de forma local en tu dispositivo:</p>
            <ul className="list-disc list-inside text-ink-600 mb-4 space-y-2">
              <li><strong>Historial de búsqueda</strong> - Tus búsquedas recientes en el diccionario, para darte acceso rápido a consultas anteriores</li>
              <li><strong>Favoritos</strong> - Las palabras y los kanji que marcas como favoritos para consultarlos fácilmente</li>
            </ul>
            <p className="text-ink-600 mb-6">
              Estos datos se almacenan solo en tu dispositivo y no se transmiten a nuestros servidores ni a ningún tercero.
            </p>

            <h3 className="text-xl font-semibold text-ink-800 mb-3">Sincronización con iCloud</h3>
            <p className="text-ink-600 mb-6">
              Si iniciaste sesión en iCloud, tus favoritos, tarjetas de estudio, notas, historial de estudio e historial de búsqueda pueden sincronizarse entre tus dispositivos mediante el servicio iCloud de Apple. Estos datos están protegidos por las políticas de privacidad de Apple y nosotros no tenemos acceso a ellos.
            </p>

            <h3 className="text-xl font-semibold text-ink-800 mb-3">Datos de publicidad</h3>
            <p className="text-ink-600 mb-2">La App usa Google AdMob para mostrar anuncios. AdMob puede recopilar:</p>
            <ul className="list-disc list-inside text-ink-600 mb-4 space-y-2">
              <li>Identificadores del dispositivo (como el identificador de publicidad)</li>
              <li>Datos generales de ubicación (a nivel de país o región)</li>
              <li>Datos de uso de la app y de interacción con ella</li>
              <li>Datos de visualización de anuncios y de interacción con ellos</li>
            </ul>
            <p className="text-ink-600">
              Google recopila estos datos, y están sujetos a la Política de privacidad de Google.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Mensajes de soporte (jisoku.app/support)</h2>
            <p className="text-ink-600 mb-4">
              Cuando envías un mensaje mediante el formulario de contacto de este sitio web, guardamos lo siguiente en nuestra base de datos (SQLite, alojada en Railway con un volumen persistente):
            </p>
            <ul className="list-disc list-inside text-ink-600 mb-4 space-y-2">
              <li>El tema y el mensaje que escribes</li>
              <li>Tu dispositivo y la versión de la app, si decides ingresarlos</li>
              <li>Tu correo electrónico, <strong>solo si decides ingresarlo</strong></li>
            </ul>
            <p className="text-ink-600 mb-4">
              El campo de correo electrónico es opcional. Si lo proporcionas, lo usamos solo para responder a ese mensaje. Nunca lo agregamos a una lista de correo ni lo compartimos. No necesitas una cuenta, y el formulario no establece cookies.
            </p>
            <p className="text-ink-600 mb-4">
              Los mensajes son privados. Solo el desarrollador puede leerlos, y nunca se publican.
            </p>

            <h3 className="text-xl font-semibold text-ink-800 mb-3">Subencargados</h3>
            <ul className="list-disc list-inside text-ink-600 mb-4 space-y-2">
              <li><strong>Cloudflare Turnstile</strong> - protección contra bots en el formulario de contacto. Cloudflare puede recopilar señales del navegador conforme a su política.</li>
              <li><strong>Railway</strong> - aloja la aplicación y la base de datos.</li>
            </ul>

            <h3 className="text-xl font-semibold text-ink-800 mb-3">Conservación</h3>
            <ul className="list-disc list-inside text-ink-600 mb-4 space-y-2">
              <li>Los mensajes se conservan durante <strong>2 años</strong> y después se eliminan. Esto incluye los tickets enviados mediante el sistema de tickets anterior de este sitio.</li>
              <li>Puedes pedirnos que eliminemos tus mensajes antes enviando una solicitud mediante el formulario de contacto.</li>
            </ul>

            <p className="text-ink-600">
              En las páginas de soporte no se carga ningún servicio de análisis ni de rastreo de terceros.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Cómo usamos tu información</h2>
            <p className="text-ink-600 mb-4">
              <strong>Datos locales:</strong> Tu historial de búsqueda y tus favoritos se usan únicamente para mejorar tu experiencia dentro de la App, dándote acceso rápido a tus elementos recientes y guardados.
            </p>
            <p className="text-ink-600 mb-4">
              <strong>Mensajes de soporte:</strong> Se usan para corregir errores, responder tus preguntas y, si dejaste un correo electrónico, contestarte.
            </p>
            <p className="text-ink-600">
              <strong>Datos de publicidad:</strong> Los datos que recopila AdMob se usan para mostrar anuncios relevantes y medir el rendimiento de los anuncios.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Compartición de datos</h2>
            <p className="text-ink-600 mb-4">
              No vendemos, intercambiamos ni transferimos tu información personal a terceros, salvo a los subencargados mencionados arriba (que actúan en nuestro nombre para operar el servicio).
            </p>
            <p className="text-ink-600">
              Fuera de la App, el único servicio de terceros que recibe datos del dispositivo es Google AdMob, con fines publicitarios.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Tus derechos</h2>
            <p className="text-ink-600 mb-2">Tienes derecho a:</p>
            <ul className="list-disc list-inside text-ink-600 mb-4 space-y-2">
              <li><strong>Acceder</strong> a tus datos almacenados en la App (visibles en el historial de búsqueda y en favoritos)</li>
              <li><strong>Eliminar</strong> tu historial de búsqueda y tus favoritos en cualquier momento</li>
              <li><strong>Solicitar el acceso a</strong> tus mensajes de soporte <strong>o su eliminación</strong> mediante el <Link href="/es/support#contact" className={linkClass}>formulario de contacto</Link></li>
              <li><strong>Desactivar</strong> la publicidad personalizada desde la configuración de tu dispositivo</li>
            </ul>
            <p className="text-ink-600">
              Para limitar el rastreo publicitario en iOS, ve a <strong>Configuración &gt; Privacidad y seguridad &gt; Rastreo</strong>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Privacidad de los menores</h2>
            <p className="text-ink-600">
              La App no está dirigida a menores de 13 años. No recopilamos a sabiendas información personal de menores de 13 años.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Enlaces de terceros</h2>
            <p className="text-ink-600">
              La App puede contener enlaces a sitios web externos (como el proyecto de diccionarios EDRDG). No somos responsables de las prácticas de privacidad de esos sitios externos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Cambios a esta política</h2>
            <p className="text-ink-600">
              Podemos actualizar esta Política de privacidad periódicamente. Cualquier cambio se reflejará en la App con una fecha de revisión actualizada.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-ink-900 mb-4">Políticas de privacidad de terceros</h2>
            <p className="text-ink-600 mb-3">Algunas de estas páginas pueden mostrarse en inglés.</p>
            <ul className="list-disc list-inside text-ink-600 space-y-2">
              <li>
                <a href="https://policies.google.com/privacy?hl=es-419" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Política de privacidad de Google AdMob
                </a>
              </li>
              <li>
                <a href="https://support.google.com/admob/answer/6128543?hl=es-419" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Recopilación de datos de Google Ads
                </a>
              </li>
              <li>
                <a href="https://www.cloudflare.com/es-la/privacypolicy/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Política de privacidad de Cloudflare
                </a>
              </li>
              <li>
                <a href="https://railway.com/legal/privacy" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Política de privacidad de Railway
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>

      <SiteFooter locale="es" />
    </div>
  )
}
