import type { Metadata } from 'next'
import Link from 'next/link'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { alternates } from '@/lib/i18n'

// Translation of src/app/(en)/privacy/page.tsx. Keep the two in sync: any change to
// the English policy needs the same change here (and the same "last updated" date).
export const metadata: Metadata = {
  title: 'Política de privacidad - Jisoku',
  description: 'Política de privacidad de la app de diccionario de japonés Jisoku y del servicio de soporte de Jisoku.',
  alternates: alternates('es', '/privacy'),
}

const linkClass = 'link'

export default function PoliticaDePrivacidadPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader active="privacy" locale="es" translatedPath="/privacy" />

      <main className="flex-1">
        <div className="border-b border-ink-100 bg-gradient-to-b from-[#f7f8fd] to-[#e4e8f7]">
          <div className="mx-auto max-w-3xl px-4 pb-10 pt-10 sm:pb-14 sm:pt-16">
            <h1 className="text-[2.6rem] font-black leading-[1.04] tracking-tight text-ink-900 sm:text-6xl">
              Política de <span className="block text-app">privacidad</span>
            </h1>
            <p className="mt-5 text-sm text-ink-600">Última actualización: octubre de 2026</p>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16 [&_strong]:font-semibold [&_strong]:text-ink-900">
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">Introducción</h2>
            <p className="mb-4 leading-relaxed text-ink-700">
              Jisoku (&quot;la App&quot;) es una aplicación de diccionario japonés-inglés. Esta Política de privacidad explica cómo recopilamos, usamos y protegemos tu información cuando usas la App o el servicio de soporte de Jisoku en jisoku.app/support.
            </p>
            <p className="leading-relaxed text-ink-700">
              Nos comprometemos a proteger tu privacidad y a ser transparentes sobre nuestras prácticas de datos.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">Información que recopilamos</h2>

            <h3 className="mb-3 text-lg font-bold text-ink-900">Datos locales (almacenados en tu dispositivo)</h3>
            <p className="mb-4 leading-relaxed text-ink-700">La App almacena los siguientes datos de forma local en tu dispositivo:</p>
            <ul className="mb-4 list-inside list-disc space-y-2 leading-relaxed text-ink-700 marker:text-app">
              <li><strong>Historial de búsqueda</strong> - Tus búsquedas recientes en el diccionario, para darte acceso rápido a consultas anteriores</li>
              <li><strong>Favoritos</strong> - Las palabras y los kanji que marcas como favoritos para consultarlos fácilmente</li>
            </ul>
            <p className="mb-6 leading-relaxed text-ink-700">
              Estos datos se almacenan solo en tu dispositivo y no se transmiten a nuestros servidores ni a ningún tercero.
            </p>

            <h3 className="mb-3 text-lg font-bold text-ink-900">Sincronización con iCloud</h3>
            <p className="mb-6 leading-relaxed text-ink-700">
              Si iniciaste sesión en iCloud, tus favoritos, tarjetas de estudio, notas, historial de estudio e historial de búsqueda pueden sincronizarse entre tus dispositivos mediante el servicio iCloud de Apple. Estos datos están protegidos por las políticas de privacidad de Apple y nosotros no tenemos acceso a ellos.
            </p>

            <h3 className="mb-3 text-lg font-bold text-ink-900">Datos de publicidad</h3>
            <p className="mb-2 leading-relaxed text-ink-700">La App usa Google AdMob para mostrar anuncios. AdMob puede recopilar:</p>
            <ul className="mb-4 list-inside list-disc space-y-2 leading-relaxed text-ink-700 marker:text-app">
              <li>Identificadores del dispositivo (como el identificador de publicidad)</li>
              <li>Datos generales de ubicación (a nivel de país o región)</li>
              <li>Datos de uso de la app y de interacción con ella</li>
              <li>Datos de visualización de anuncios y de interacción con ellos</li>
            </ul>
            <p className="leading-relaxed text-ink-700">
              Google recopila estos datos, y están sujetos a la Política de privacidad de Google.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">Mensajes de soporte (jisoku.app/support)</h2>
            <p className="mb-4 leading-relaxed text-ink-700">
              Cuando envías un mensaje mediante el formulario de contacto de este sitio web, guardamos lo siguiente en nuestra base de datos (SQLite, alojada en Railway con un volumen persistente):
            </p>
            <ul className="mb-4 list-inside list-disc space-y-2 leading-relaxed text-ink-700 marker:text-app">
              <li>El tema y el mensaje que escribes</li>
              <li>Tu dispositivo y la versión de la app, si decides ingresarlos</li>
              <li>Tu correo electrónico, <strong>solo si decides ingresarlo</strong></li>
            </ul>
            <p className="mb-4 leading-relaxed text-ink-700">
              El campo de correo electrónico es opcional. Si lo proporcionas, lo usamos solo para responder a ese mensaje. Nunca lo agregamos a una lista de correo ni lo compartimos. No necesitas una cuenta, y el formulario no establece cookies.
            </p>
            <p className="mb-4 leading-relaxed text-ink-700">
              Los mensajes son privados. Solo el desarrollador puede leerlos, y nunca se publican.
            </p>

            <h3 className="mb-3 text-lg font-bold text-ink-900">Subencargados</h3>
            <ul className="mb-4 list-inside list-disc space-y-2 leading-relaxed text-ink-700 marker:text-app">
              <li><strong>Cloudflare Turnstile</strong> - protección contra bots en el formulario de contacto. Cloudflare puede recopilar señales del navegador conforme a su política.</li>
              <li><strong>Railway</strong> - aloja la aplicación y la base de datos.</li>
            </ul>

            <h3 className="mb-3 text-lg font-bold text-ink-900">Conservación</h3>
            <ul className="mb-4 list-inside list-disc space-y-2 leading-relaxed text-ink-700 marker:text-app">
              <li>Los mensajes se conservan durante <strong>2 años</strong> y después se eliminan. Esto incluye los tickets enviados mediante el sistema de tickets anterior de este sitio.</li>
              <li>Puedes pedirnos que eliminemos tus mensajes antes enviando una solicitud mediante el formulario de contacto.</li>
            </ul>

            <p className="leading-relaxed text-ink-700">
              En las páginas de soporte no se carga ningún servicio de análisis ni de rastreo de terceros.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">Cómo usamos tu información</h2>
            <p className="mb-4 leading-relaxed text-ink-700">
              <strong>Datos locales:</strong> Tu historial de búsqueda y tus favoritos se usan únicamente para mejorar tu experiencia dentro de la App, dándote acceso rápido a tus elementos recientes y guardados.
            </p>
            <p className="mb-4 leading-relaxed text-ink-700">
              <strong>Mensajes de soporte:</strong> Se usan para corregir errores, responder tus preguntas y, si dejaste un correo electrónico, contestarte.
            </p>
            <p className="leading-relaxed text-ink-700">
              <strong>Datos de publicidad:</strong> Los datos que recopila AdMob se usan para mostrar anuncios relevantes y medir el rendimiento de los anuncios.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">Compartición de datos</h2>
            <p className="mb-4 leading-relaxed text-ink-700">
              No vendemos, intercambiamos ni transferimos tu información personal a terceros, salvo a los subencargados mencionados arriba (que actúan en nuestro nombre para operar el servicio).
            </p>
            <p className="leading-relaxed text-ink-700">
              Fuera de la App, el único servicio de terceros que recibe datos del dispositivo es Google AdMob, con fines publicitarios.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">Tus derechos</h2>
            <p className="mb-2 leading-relaxed text-ink-700">Tienes derecho a:</p>
            <ul className="mb-4 list-inside list-disc space-y-2 leading-relaxed text-ink-700 marker:text-app">
              <li><strong>Acceder</strong> a tus datos almacenados en la App (visibles en el historial de búsqueda y en favoritos)</li>
              <li><strong>Eliminar</strong> tu historial de búsqueda y tus favoritos en cualquier momento</li>
              <li><strong>Solicitar el acceso a</strong> tus mensajes de soporte <strong>o su eliminación</strong> mediante el <Link href="/es/support#contact" className={linkClass}>formulario de contacto</Link></li>
              <li><strong>Desactivar</strong> la publicidad personalizada desde la configuración de tu dispositivo</li>
            </ul>
            <p className="leading-relaxed text-ink-700">
              Para limitar el rastreo publicitario en iOS, ve a <strong>Configuración &gt; Privacidad y seguridad &gt; Rastreo</strong>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">Privacidad de los menores</h2>
            <p className="leading-relaxed text-ink-700">
              La App no está dirigida a menores de 13 años. No recopilamos a sabiendas información personal de menores de 13 años.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">Enlaces de terceros</h2>
            <p className="leading-relaxed text-ink-700">
              La App puede contener enlaces a sitios web externos (como el proyecto de diccionarios EDRDG). No somos responsables de las prácticas de privacidad de esos sitios externos.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">Cambios a esta política</h2>
            <p className="leading-relaxed text-ink-700">
              Podemos actualizar esta Política de privacidad periódicamente. Cualquier cambio se reflejará en la App con una fecha de revisión actualizada.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-black tracking-tight text-ink-900 sm:text-3xl">Políticas de privacidad de terceros</h2>
            <p className="mb-3 leading-relaxed text-ink-700">Algunas de estas páginas pueden mostrarse en inglés.</p>
            <ul className="list-inside list-disc space-y-2 leading-relaxed text-ink-700 marker:text-app">
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
