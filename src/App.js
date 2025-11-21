import React, { useState, useEffect } from 'react';
import { Film, Settings, PlayCircle, Sparkles, Check, Clock, Loader, Youtube } from 'lucide-react';

const API_URL = 'https://youtube-automation-2zba.onrender.com';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [videos, setVideos] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('automation-videos');
    if (saved) {
      setVideos(JSON.parse(saved));
    }
  }, []);

  const generateVideo = async () => {
    setIsProcessing(true);
    
    const newVideo = {
      id: Date.now(),
      status: 'generating',
      progress: 0,
      createdAt: new Date().toISOString()
    };
    
    setCurrentVideo(newVideo);

    try {
      newVideo.status = 'Generating story...';
      newVideo.progress = 20;
      setCurrentVideo({...newVideo});
      
      const response = await fetch(API_URL + '/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        newVideo.story = result.story;
        newVideo.title = result.story.title_english;
        newVideo.progress = 100;
        newVideo.status = 'completed';
        
        const updatedVideos = [...videos, newVideo];
        setVideos(updatedVideos);
        localStorage.setItem('automation-videos', JSON.stringify(updatedVideos));
        
        alert('Video generated: ' + newVideo.title);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
    
    setCurrentVideo(null);
    setIsProcessing(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #dbeafe, #fae8ff)', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <Youtube size={48} color="#dc2626" />
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Funny Animated Stories</h1>
              <p style={{ color: '#666', margin: 0 }}>Automated YouTube System</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', background: 'white', padding: '0.5rem', borderRadius: '1rem', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <button onClick={() => setActiveTab('dashboard')} style={{ flex: 1, padding: '1rem', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', background: activeTab === 'dashboard' ? '#3b82f6' : 'transparent', color: activeTab === 'dashboard' ? 'white' : '#666' }}>
            Dashboard
          </button>
          <button onClick={() => setActiveTab('videos')} style={{ flex: 1, padding: '1rem', border: 'none', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer', background: activeTab === 'videos' ? '#3b82f6' : 'transparent', color: activeTab === 'videos' ? 'white' : '#666' }}>
            Videos
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)', color: 'white', padding: '2rem', borderRadius: '1rem' }}>
                <p style={{ opacity: 0.9, fontSize: '0.875rem' }}>Total Videos</p>
                <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{videos.length}</p>
              </div>
              
              <div style={{ background: 'linear-gradient(to bottom right, #10b981, #059669)', color: 'white', padding: '2rem', borderRadius: '1rem' }}>
                <p style={{ opacity: 0.9, fontSize: '0.875rem' }}>Completed</p>
                <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{videos.filter(v => v.status === 'completed').length}</p>
              </div>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Quick Actions</h2>
              <button onClick={generateVideo} disabled={isProcessing} style={{ width: '100%', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', color: 'white', padding: '1.5rem', border: 'none', borderRadius: '0.75rem', fontSize: '1.125rem', fontWeight: 'bold', cursor: 'pointer', opacity: isProcessing ? 0.5 : 1 }}>
                {isProcessing ? 'Generating...' : 'Generate Video Now'}
              </button>
            </div>

            {currentVideo && (
              <div style={{ background: 'linear-gradient(to right, #8b5cf6, #ec4899)', color: 'white', padding: '2rem', borderRadius: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Processing...</h3>
                <p>{currentVideo.status}</p>
                <div style={{ background: 'rgba(255,255,255,0.3)', height: '1rem', borderRadius: '999px', overflow: 'hidden', marginTop: '1rem' }}>
                  <div style={{ background: 'white', height: '100%', width: currentVideo.progress + '%', transition: 'width 0.5s' }}></div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Generated Videos</h2>
            
            {videos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '1rem' }}>
                <Film size={64} color="#ccc" style={{ margin: '0 auto 1rem' }} />
                <p style={{ color: '#666' }}>No videos yet. Click Generate Video Now!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {videos.slice().reverse().map(video => (
                  <div key={video.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{video.title || 'Processing...'}</h3>
                    {video.story && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <span style={{ background: '#e9d5ff', color: '#7c3aed', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem' }}>
                          {video.story.category}
                        </span>
                        <p style={{ color: '#666', fontSize: '0.875rem', marginTop: '0.5rem' }}>{video.story.moral}</p>
                      </div>
                    )}
                    <p style={{ color: '#999', fontSize: '0.75rem', marginTop: '1rem' }}>
                      Created: {new Date(video.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
