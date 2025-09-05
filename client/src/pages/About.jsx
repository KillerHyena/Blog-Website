import CallToAction from '../components/CallToAction';

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>
            Hola to Veloci's Hideout
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              This is more than just a blog — it’s a little corner of the web
              where words, art, code, and stories come together. A place for
              curious minds who enjoy building things, breaking them, and
              finding beauty in the process.
            </p>

            <p>
              Here you’ll find reflections from a coder who loves the elegance
              of logic, a poet who searches for rhythm in silence, an artist who
              sketches worlds out of imagination, a book lover wandering through
              endless pages, and a gamer who sees stories unfold on glowing
              screens.
            </p>

            <p>
              Every post is a piece of that journey — sometimes technical,
              sometimes personal, sometimes just playful. I believe creativity
              thrives at the crossroads of disciplines, and this hideout is a
              space to explore, learn, and share freely.
            </p>
          </div>
        </div>
        <div className='mt-10'>
          <CallToAction />
        </div>
      </div>
    </div>
  );
}