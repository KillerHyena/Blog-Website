import CallToAction from '../components/CallToAction';

export default function Projects() {
  return (
    <div className='min-h-screen max-w-4xl mx-auto flex justify-center gap-8 items-center flex-col p-6'>
      <h1 className='text-4xl font-bold text-center'>The Workshop of Ideas</h1>
      <p className='text-lg text-gray-600 text-center max-w-3xl'>
        Welcome to my little workshop — a place where experiments turn into
        projects and imagination takes shape in lines of code, strokes of art,
        and fragments of poetry.  
        <br />Whether it’s building something playful, crafting a digital
        story, or solving puzzles through code, every project is a step deeper
        into curiosity.
      </p>
      <div className='w-full flex flex-col gap-6'>
        <section className='bg-gray-100 p-6 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold dark:text-gray-900'>
            Why I Build Things
          </h2>
          <p className='text-gray-700 mt-2'>
            Projects are more than practice — they’re a playground. They let me
            merge logic with creativity, test wild ideas, and leave behind
            artifacts of what I’ve learned along the way. Each build is both a
            challenge and a story waiting to be told.
          </p>
        </section>
        <section className='bg-gray-100 p-6 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold dark:text-gray-900'>
            What You’ll Discover Here
          </h2>
          <ul className='list-disc list-inside text-gray-700 mt-2'>
            <li>Creative coding projects that mix function with fun</li>
            <li>Art-inspired builds where design speaks louder than code</li>
            <li>Interactive experiments that feel like little games</li>
            <li>Personal tools born out of curiosity and late-night tinkering</li>
            <li>Stories woven into lines of code, waiting to be explored</li>
          </ul>
        </section>
      </div>
      <CallToAction />
    </div>
  );
}
