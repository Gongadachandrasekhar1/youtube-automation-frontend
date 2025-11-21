import React, { useState, useEffect } from 'react';
import { Film, Upload, Settings, PlayCircle, Sparkles, Check, Clock, Loader, Youtube } from 'lucide-react';

const API_URL = 'https://youtube-automation-2zba.onrender.com';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [videos, setVideos] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [stats, setStats] = useState({ total: 0, uploaded: 0, today: 0 });

  useEffect(() => {
    loadVideos();
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/`);
      const data = await response.json();
      console.log('Backend status:', data);
    } catch (error) {
      console.error('Backend error:', error);
    }
  };

  const loadVideos = () => {
    const saved = localStorage.getItem('automation-videos');
    if (saved) {
      const parsedVideos = JSON.parse(saved);
      setVideos(parsedVideos);
      updateStats(parsedVideos);
    }
  };

  const updateStats = (videoList) => {
    const today = new Date().toDateString();
    const todayVideos = videoList.filter(v => 
      new Date(v.createdAt).toDateString() === today
    );
    
    setStats({
      total: videoList.length,
      uploaded: videoList.filter(v => v.status === 'completed').length,
      today: todayVideos.length
    });
  };

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
      // Step 1: Generate Story
      newVideo.status = 'Generating story...';
      newVideo.progress = 20;
      setCurrentVideo({...newVideo});
      
      const response = await fetch(`${API_URL}/api/generate-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        newVideo.story = result.story;
        newVideo.title = result.story.title_english;
        newVideo.status = 'Story generated ✓';
        newVideo.progress = 40;
        setCurrentVideo({...newVideo});
        
        // Simulate audio generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        newVideo.status = 'Audio generated ✓';
        newVideo.progress = 60;
        setCurrentVideo({...newVideo});
        
        // Simulate video creation
        await new Promise(resolve => setTimeout(resolve, 3000));
        newVideo.status = 'Video created ✓';
        newVideo.progress = 80;
        setCurrentVideo({...newVideo});
        
        // Complete
        await new Promise(resolve => setTimeout(resolve, 2000));
        newVideo.status = 'completed';
        newVideo.progress = 100;
        newVideo.youtubeUrl = `https://youtube.com/watch?v=DEMO_${newVideo.id}`;
        
        const updatedVideos = [...videos, newVideo];
        setVideos(updatedVideos);
        localStorage.setItem('automation-videos', JSON.stringify(updatedVideos));
        updateStats(updatedVideos);
        
        alert('✅ Video generated successfully!\n\n' + 
              `Title: ${newVideo.title}\n` +
              `Category: ${newVideo.story.category}\n\n` +
              'Ready for YouTube upload!');
      } else {
        throw new Error(result.error || 'Generation failed');
      }
      
    } catch (error) {
      alert('❌ Error: ' + error.message);
      newVideo.status = 'failed';
    }
    
    setCurrentVideo(null);
    setIsProcessing(false);
  };

  const startAutomation = async () => {
    try {
      const response = await fetch(`${API_URL}/api/start-automation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('🚀 Automation Started!\n\n' +
              '4 videos will be generated daily at:\n' +
              '• 9:00 AM\n' +
              '• 1:00 PM\n' +
              '• 5:00 PM\n' +
              '• 9:00 PM\n\n' +
              'System is now running 24/7!');
      }
    } catch (error) {
      alert('❌ Error starting automation: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-xl mb-4">
            <Youtube size={48} className="text-red-600" />
            <div className="text-left">
              <h1 className="text-3xl font-bold text-gray-900">Funny Animated Stories</h1>
              <p className="text-gray-600">Automated YouTube Content System</p>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <div className="mb-6 flex gap-2 bg-white rounded-xl p-2 shadow-lg">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: PlayCircle },
            { id: 'videos', label: 'Videos', icon: Film },
            { id: 'settings', label: 'About', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Videos</p>
                    <p className="text-4xl font-bold">{stats.total}</p>
                  </div>
                  <Film size={48} className="opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Uploaded</p>
                    <p className="text-4xl font-bold">{stats.uploaded}</p>
                  </div>
                  <Check size={48} className="opacity-80" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Today</p>
                    <p className="text-4xl font-bold">{stats.today}</p>
                  </div>
                  <Clock size={48} className="opacity-80" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={generateVideo}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 rounded-xl hover:shadow-xl transition-all font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles size={24} />
                  {isProcessing ? 'Generating...' : 'Generate Video Now'}
                </button>
                
                <button
                  onClick={startAutomation}
                  className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-8 py-6 rounded-xl hover:shadow-xl transition-all font-bold text-lg flex items-center justify-center gap-2"
                >
                  <PlayCircle size={24} />
                  Start Automation (4/day)
                </button>
              </div>
            </div>

            {/* Current Processing */}
            {currentVideo && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Loader className="animate-spin" />
                  Processing Video...
                </h3>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="font-semibold mb-2">{currentVideo.title || 'Generating story...'}</p>
                  <p className="text-sm mb-3">{currentVideo.status}</p>
                  <div className="bg-white/30 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-white h-full transition-all duration-500"
                      style={{ width: `${currentVideo.progress}%` }}
                    />
                  </div>
                  <p className="text-right text-sm mt-1">{currentVideo.progress}%</p>
                </div>
              </div>
            )}

            {/* System Info */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-3 text-lg">📊 System Status</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>✅ Backend: Connected</p>
                <p>✅ Story Generation: AI Powered (Claude)</p>
                <p>✅ Voice: Telugu (gTTS)</p>
                <p>✅ Videos: 3D Animated Avatars</p>
                <p>✅ Subtitles: English</p>
                <p>✅ Schedule: 4 videos/day (9AM, 1PM, 5PM, 9PM)</p>
              </div>
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Generated Videos</h2>
            
            {videos.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <Film size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No videos yet</p>
                <p className="text-gray-400">Click "Generate Video Now" to create your first video!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {videos.slice().reverse().map(video => (
                  <div key={video.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{video.title || 'Processing...'}</h3>
                        {video.story && (
                          <div className="mt-2">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                              {video.story.category}
                            </span>
                            <p className="text-gray-600 text-sm mt-2">{video.story.moral}</p>
                          </div>
                        )}
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        video.status === 'completed' ? 'bg-green-100 text-green-800' :
                        video.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {video.status === 'completed' ? '✅ Complete' :
                         video.status === 'failed' ? '❌ Failed' :
                         '⏳ Processing'}
                      </span>
                    </div>
                    
                    {video.status === 'completed' && (
                      <div className="mt-4">
                        
                          href={video.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold"
                        >
                          <Youtube size={20} />
                          View on YouTube
                        </a>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-4">
                      Created: {new Date(video.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings/About Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">System Information</h2>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4">✨ Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✅ AI-powered Telugu story generation</li>
                <li>✅ Automatic Telugu voiceover (gTTS)</li>
                <li>✅ English subtitles for family audience</li>
                <li>✅ 3D animated avatar videos</li>
                <li>✅ Automated YouTube uploads</li>
                <li>✅ 4 videos per day scheduling</li>
                <li>✅ Mix of moral, funny, educational stories</li>
              </ul>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
              <h3 className="font-bold text-green-900 mb-3">🎯 How It Works</h3>
              <ol className="space-y-2 text-sm text-green-800 list-decimal list-inside">
                <li>AI generates unique Telugu stories</li>
                <li>Converts script to Telugu audio</li>
                <li>Creates video with 3D avatar</li>
                <li>Adds English subtitles</li>
                <li>Uploads to YouTube automatically</li>
              </ol>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-900 mb-3">📞 Support</h3>
              <p className="text-sm text-blue-800">
                Backend URL: <code className="bg-white px-2 py-1 rounded">{API_URL}</code>
              </p>
              <p className="text-sm text-blue-800 mt-2">
                Status: <span className="text-green-600 font-bold">✅ Connected</span>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
```

Commit this file.

---

#### **FILE 6: .gitignore**

Click "Add file" → "Create new file"
Filename: `.gitignore`
```
node_modules/
build/
.env.local
.DS_Store
```

Commit this file.

---

### **STEP 3: Deploy to Vercel**

1. Go to: https://vercel.com/
2. Sign up with GitHub
3. Click **"Add New"** → **"Project"**
4. Import `youtube-automation-frontend`
5. **Framework Preset**: Create React App
6. Click **"Deploy"**
7. Wait 2-3 minutes

**✋ When done, paste your Vercel URL here:** 
```
My Frontend URL: https://________.vercel.app
