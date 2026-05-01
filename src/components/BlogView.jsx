import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag, Sparkles } from 'lucide-react';
import blogData from '../../marketing/blog_posts.json';

const BlogView = ({ setView }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // In a real app, you'd fetch this from an API
    setPosts(blogData);
  }, []);

  return (
    <div style={{ 
      background: '#0f0f1a', 
      minHeight: '100vh', 
      color: 'white', 
      fontFamily: 'Fredoka, sans-serif',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* --- 🚀 HEADER --- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '60px' }}>
          <button 
            onClick={() => setView('landing')}
            className="kids-button secondary"
            style={{ padding: '10px', borderRadius: '15px' }}
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 style={{ fontSize: '2.5rem', margin: 0, color: '#ffbe0b' }}>
              <Sparkles style={{ verticalAlign: 'middle', marginRight: '10px' }} />
              The Magic Dev Blog
            </h1>
            <p style={{ opacity: 0.6, margin: '5px 0 0 0' }}>Weekly updates from the Sparks team</p>
          </div>
        </div>

        {/* --- 📝 POSTS LIST --- */}
        <div style={{ display: 'grid', gap: '40px' }}>
          {posts.map(post => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass"
              style={{ padding: '40px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', opacity: 0.5, marginBottom: '15px', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {post.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={14} /> {post.author}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Tag size={12} /> {tag}</span>
                  ))}
                </div>
              </div>
              
              <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'white' }}>{post.title}</h2>
              <div style={{ lineHeight: 1.8, opacity: 0.9, fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)' }}>
                {post.content}
              </div>
            </motion.article>
          ))}
        </div>

        {/* --- 🏁 FOOTER --- */}
        <div style={{ textAlign: 'center', marginTop: '80px', opacity: 0.4 }}>
          <p>Want to stay updated? Follow us on Discord!</p>
          <button 
            className="kids-button primary"
            style={{ marginTop: '20px', padding: '15px 40px' }}
            onClick={() => window.open('https://discord.gg/sparkmagic', '_blank')}
          >
            Join our Discord
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogView;
