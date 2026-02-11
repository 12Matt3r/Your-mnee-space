import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { GlobalMusicProvider } from './components/music/GlobalMusicProvider';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import { Web3Provider } from './components/web3/Web3Provider';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PageLoader } from './components/ui/PageLoader';

// Eagerly loaded critical pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DiscordCallbackPage } from './pages/auth/DiscordCallbackPage';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';

import './App.css';

// Lazy loaded pages
const DiscoverPage = lazy(() => import('./pages/discover/DiscoverPage').then(module => ({ default: module.DiscoverPage })));
const ArtistDiscoveryPage = lazy(() => import('./pages/discover/ArtistDiscoveryPage').then(module => ({ default: module.ArtistDiscoveryPage })));
const ArtistDirectoryPage = lazy(() => import('./pages/ArtistDirectoryPage').then(module => ({ default: module.ArtistDirectoryPage })));
const ArtistProfilePage = lazy(() => import('./pages/ArtistProfilePage').then(module => ({ default: module.ArtistProfilePage })));
const CreatePage = lazy(() => import('./pages/create/CreatePage').then(module => ({ default: module.CreatePage })));
const CollaboratePage = lazy(() => import('./pages/collaborate/CollaboratePage').then(module => ({ default: module.CollaboratePage })));
const MarketplacePage = lazy(() => import('./pages/marketplace/MarketplacePage').then(module => ({ default: module.MarketplacePage })));
const VirtualRoomsPage = lazy(() => import('./pages/rooms/VirtualRoomsPage').then(module => ({ default: module.VirtualRoomsPage })));
const MyVirtualRoomsPage = lazy(() => import('./pages/rooms/MyVirtualRoomsPage').then(module => ({ default: module.MyVirtualRoomsPage })));
const VirtualRoomEditorPage = lazy(() => import('./pages/rooms/VirtualRoomEditorPage').then(module => ({ default: module.VirtualRoomEditorPage })));
const VirtualRoomViewPage = lazy(() => import('./pages/rooms/VirtualRoomViewPage').then(module => ({ default: module.VirtualRoomViewPage })));
const CreatorStudioPage = lazy(() => import('./pages/studio/CreatorStudioPage').then(module => ({ default: module.CreatorStudioPage })));
const AnalyticsPage = lazy(() => import('./pages/analytics/AnalyticsPage').then(module => ({ default: module.AnalyticsPage })));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage').then(module => ({ default: module.ProfilePage })));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage').then(module => ({ default: module.SettingsPage })));
const AgentsPage = lazy(() => import('./pages/agents/AgentsPage').then(module => ({ default: module.AgentsPage })));
const LearningPage = lazy(() => import('./pages/learning/LearningPage').then(module => ({ default: module.LearningPage })));
const ModuleViewerPage = lazy(() => import('./pages/learning/ModuleViewerPage').then(module => ({ default: module.ModuleViewerPage })));
const WalletPage = lazy(() => import('./pages/wallet/WalletPage').then(module => ({ default: module.WalletPage })));
const SubscriptionPage = lazy(() => import('./pages/monetization/SubscriptionPage').then(module => ({ default: module.SubscriptionPage })));
const LivePage = lazy(() => import('./pages/live/LivePage').then(module => ({ default: module.LivePage })));
const GovernancePage = lazy(() => import('./pages/governance/GovernancePage').then(module => ({ default: module.GovernancePage })));
const CreateAgentPage = lazy(() => import('./pages/agents/CreateAgentPage').then(module => ({ default: module.CreateAgentPage })));
const AdminPage = lazy(() => import('./pages/admin/AdminPage').then(module => ({ default: module.AdminPage })));

// Default exports
const SocialFeedPage = lazy(() => import('./pages/social/SocialFeedPage'));
const MessagesPage = lazy(() => import('./pages/messages/MessagesPage'));
const BuyMNEE = lazy(() => import('./pages/BuyMNEE'));
const Subscribe = lazy(() => import('./pages/Subscribe'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Web3Provider>
          <ThemeProvider>
            <GlobalMusicProvider>
              <MusicPlayerProvider>
              <div className="App">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                  {/* Auth routes without layout */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/welcome" element={<OnboardingPage />} />
                  <Route path="/auth/discord/callback" element={<DiscordCallbackPage />} />

                  {/* Main app routes with layout */}
                  <Route path="/" element={
                    <Layout>
                      <HomePage />
                    </Layout>
                  } />

                  <Route path="/discover" element={
                    <Layout>
                      <DiscoverPage />
                    </Layout>
                  } />

                  <Route path="/social" element={
                    <Layout>
                      <SocialFeedPage />
                    </Layout>
                  } />

                  <Route path="/discover-artists" element={
                    <Layout>
                      <ArtistDiscoveryPage />
                    </Layout>
                  } />

                  <Route path="/artists" element={
                    <Layout>
                      <ArtistDirectoryPage />
                    </Layout>
                  } />

                  <Route path="/artist/:artistId" element={
                    <Layout>
                      <ArtistProfilePage />
                    </Layout>
                  } />

                  <Route path="/marketplace" element={
                    <Layout>
                      <MarketplacePage />
                    </Layout>
                  } />

                  <Route path="/wallet" element={
                    <Layout>
                      <WalletPage />
                    </Layout>
                  } />

                  <Route path="/subscription" element={
                    <Layout>
                      <SubscriptionPage />
                    </Layout>
                  } />

                  <Route path="/live" element={
                    <Layout>
                      <LivePage />
                    </Layout>
                  } />

                  <Route path="/governance" element={
                    <Layout>
                      <GovernancePage />
                    </Layout>
                  } />

                  <Route path="/buy-mnee" element={<BuyMNEE />} />
                  <Route path="/subscribe" element={<Subscribe />} />

                  <Route path="/agents" element={
                    <Layout>
                      <AgentsPage />
                    </Layout>
                  } />

                  <Route path="/agents/create" element={
                    <Layout>
                      <CreateAgentPage />
                    </Layout>
                  } />

                  <Route path="/admin" element={
                    <Layout>
                      <AdminPage />
                    </Layout>
                  } />

                  <Route path="/rooms" element={
                    <Layout>
                      <VirtualRoomsPage />
                    </Layout>
                  } />

                  <Route path="/rooms/:id" element={
                    <Layout>
                      <VirtualRoomViewPage />
                    </Layout>
                  } />

                  <Route path="/learning" element={
                    <Layout>
                      <LearningPage />
                    </Layout>
                  } />

                  <Route path="/learning/modules/:id" element={
                    <Layout>
                      <ModuleViewerPage />
                    </Layout>
                  } />

                  {/* Protected routes */}
                  <Route path="/create" element={
                    <ProtectedRoute>
                      <Layout>
                        <CreatePage />
                      </Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/collaborate" element={
                    <ProtectedRoute>
                      <Layout>
                        <CollaboratePage />
                      </Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <Layout>
                        <MessagesPage />
                      </Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/rooms/manage" element={
                    <ProtectedRoute>
                      <Layout>
                        <MyVirtualRoomsPage />
                      </Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/rooms/edit/:id" element={
                    <ProtectedRoute>
                      <Layout>
                        <VirtualRoomEditorPage />
                      </Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/studio" element={
                    <ProtectedRoute>
                      <Layout>
                        <CreatorStudioPage />
                      </Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/analytics" element={
                    <ProtectedRoute>
                      <Layout>
                        <AnalyticsPage />
                      </Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Layout>
                        <ProfilePage />
                      </Layout>
                    </ProtectedRoute>
                  } />

                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Layout>
                        <SettingsPage />
                      </Layout>
                    </ProtectedRoute>
                  } />

                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </div>
              </MusicPlayerProvider>
            </GlobalMusicProvider>
          </ThemeProvider>
        </Web3Provider>
      </AuthProvider>
    </Router>
  );
}

export default App;
