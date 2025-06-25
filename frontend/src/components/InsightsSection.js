const articles = [
  {
    tag: 'Featured',
    title: 'The Science Behind AI-Powered Mental Health Support',
    summary: 'A comprehensive review of the evolution, current applications, and future challenges of AI in mental health and well-being.',
    author: 'Hari Mohan Pandey',
    date: 'Jan 2024',
    readTime: 'Short Review',
    image: 'https://images.unsplash.com/photo-1473091534298-04dcbce3278c',
    link: 'https://arxiv.org/pdf/2501.10374',
    cta: 'Read Full Article',
    tagColor: 'bg-gradient-to-r from-primary-400 to-secondary-400 text-white'
  },
  {
    tag: 'Therapy',
    title: 'Understanding Cognitive Behavioral Therapy in Digital Formats',
    summary: 'A research paper on how CBT techniques are being adapted for AI-driven platforms while maintaining clinical effectiveness.',
    author: 'Anja Thieme',
    date: 'Nov 2021',
    readTime: 'Research Paper',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    link: 'https://arxiv.org/pdf/2111.06667',
    cta: 'Read More',
    tagColor: 'bg-primary-100 text-primary-700'
  },
  {
    tag: 'Privacy',
    title: 'Privacy and Security in AI Mental Health Applications',
    summary: 'A detailed look at privacy and security issues in AI-powered mental health platforms.',
    author: 'Aishik Mandal, Tanmoy Chakraborty, Iryna Gurevych',
    date: 'Feb 2024',
    readTime: 'Research Paper',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
    link: 'https://arxiv.org/pdf/2502.00451',
    cta: 'Read More',
    tagColor: 'bg-secondary-100 text-secondary-700'
  }
];

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {articles.map((article, idx) => (
    <div key={idx} className="glass rounded-3xl overflow-hidden shadow-lg flex flex-col h-full">
      <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${article.tagColor}`}>{article.tag}</span>
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2">{article.title}</h3>
        <p className="text-neutral-600 mb-4 flex-1">{article.summary}</p>
        <div className="flex items-center text-sm text-neutral-500 mb-2">
          <span className="mr-2">{article.author}</span>
          <span className="mx-2">•</span>
          <span>{article.date}</span>
          <span className="mx-2">•</span>
          <span>{article.readTime}</span>
        </div>
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-lg w-fit mt-4"
        >
          {article.cta}
        </a>
      </div>
    </div>
  ))}
</div> 