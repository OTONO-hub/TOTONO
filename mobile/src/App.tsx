import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  Session,
} from "@supabase/supabase-js";
import {
  Bell,
  Home,
  Search,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  NotificationRealtimeSync,
} from "./components/NotificationRealtimeSync";
import {
  supabase,
} from "./lib/supabase";
import {
  BlockedUsersScreen,
} from "./screens/BlockedUsersScreen";
import {
  CommunityScreen,
} from "./screens/CommunityScreen";
import {
  CreatePostScreen,
} from "./screens/CreatePostScreen";
import {
  EditPostScreen,
} from "./screens/EditPostScreen";
import {
  EditProfileScreen,
} from "./screens/EditProfileScreen";
import {
  LoginScreen,
} from "./screens/LoginScreen";
import {
  NotificationsScreen,
} from "./screens/NotificationsScreen";
import {
  PostDetailScreen,
} from "./screens/PostDetailScreen";
import {
  ProfileScreen,
} from "./screens/ProfileScreen";
import {
  SaunaDetailScreen,
} from "./screens/SaunaDetailScreen";
import {
  SavedPostsScreen,
} from "./screens/SavedPostsScreen";
import {
  SearchScreen,
} from "./screens/SearchScreen";
import {
  TodayScreen,
} from "./screens/TodayScreen";
import {
  UserProfileScreen,
} from "./screens/UserProfileScreen";
import type {
  Sauna,
} from "./services/saunas";
import type {
  Post,
} from "./types/post";

type Tab =
  | "today"
  | "search"
  | "community"
  | "notifications"
  | "profile";

type SearchView =
  | "search"
  | "detail"
  | "create-post"
  | "post-complete";

export function App() {
  const [
    session,
    setSession,
  ] =
    useState<Session | null>(
      null
    );

  const [
    ready,
    setReady,
  ] =
    useState(
      !supabase
    );

  const [
    authInitializationError,
    setAuthInitializationError,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    authRetryKey,
    setAuthRetryKey,
  ] =
    useState(
      0
    );

  const [
    tab,
    setTab,
  ] =
    useState<Tab>(
      "today"
    );

  const [
    searchView,
    setSearchView,
  ] =
    useState<SearchView>(
      "search"
    );

  const [
    selectedSauna,
    setSelectedSauna,
  ] =
    useState<Sauna | null>(
      null
    );

  const [
    createdPost,
    setCreatedPost,
  ] =
    useState<Post | null>(
      null
    );

  const [
    selectedPostId,
    setSelectedPostId,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    editingPostId,
    setEditingPostId,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    selectedProfileUserId,
    setSelectedProfileUserId,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    editingProfile,
    setEditingProfile,
  ] =
    useState(
      false
    );

  const [
    viewingSavedPosts,
    setViewingSavedPosts,
  ] =
    useState(
      false
    );

  const [
    viewingBlockedUsers,
    setViewingBlockedUsers,
  ] =
    useState(
      false
    );

  const [
    unreadNotificationCount,
    setUnreadNotificationCount,
  ] =
    useState(
      0
    );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const authClient =
      supabase;

    let cancelled =
      false;

    async function initializeSession() {
      try {
        const {
          data,
          error,
        } =
          await authClient.auth
            .getSession();

        if (cancelled) {
          return;
        }

        if (error) {
          throw error;
        }

        setSession(
          data.session
        );

        setAuthInitializationError(
          null
        );

        setReady(
          true
        );
      } catch (
        initializationError
      ) {
        if (cancelled) {
          return;
        }

        setSession(
          null
        );

        setAuthInitializationError(
          initializationError instanceof
            Error
            ? initializationError.message
            : "ログイン状態を確認できませんでした。"
        );

        setReady(
          true
        );
      }
    }

    void initializeSession();

    const {
      data: {
        subscription,
      },
    } =
      authClient.auth
        .onAuthStateChange(
          (
            _event,
            nextSession
          ) => {
            if (cancelled) {
              return;
            }

            setSession(
              nextSession
            );

            setAuthInitializationError(
              null
            );

            setReady(
              true
            );
          }
        );

    return () => {
      cancelled =
        true;

      subscription
        .unsubscribe();
    };
  }, [
    authRetryKey,
  ]);

  useEffect(() => {
    window.scrollTo({
      top:
        0,
      left:
        0,
      behavior:
        "auto",
    });
  }, [
    tab,
    searchView,
    selectedPostId,
    editingPostId,
    selectedProfileUserId,
    editingProfile,
    viewingSavedPosts,
    viewingBlockedUsers,
  ]);

  function retryAuthInitialization() {
    setReady(
      false
    );

    setAuthInitializationError(
      null
    );

    setAuthRetryKey(
      (
        currentKey
      ) =>
        currentKey +
        1
    );
  }

  if (!ready) {
    return (
      <LaunchScreen />
    );
  }

  if (
    authInitializationError
  ) {
    return (
      <AuthInitializationErrorScreen
        message={
          authInitializationError
        }
        onRetry={
          retryAuthInitialization
        }
      />
    );
  }

  if (!session) {
    return (
      <LoginScreen />
    );
  }

  const currentUserId =
    session.user.id;

  function resetSearchFlow() {
    setSelectedSauna(
      null
    );

    setCreatedPost(
      null
    );

    setSearchView(
      "search"
    );
  }

  function closePostDetail() {
    setEditingPostId(
      null
    );

    setSelectedPostId(
      null
    );
  }

  function openPostDetail(
    postId: string
  ) {
    setEditingPostId(
      null
    );

    setSelectedPostId(
      postId
    );
  }

  function openPostEditor(
    postId: string
  ) {
    setEditingPostId(
      postId
    );
  }

  function closePostEditor() {
    setEditingPostId(
      null
    );
  }

  function openUserProfile(
    userId: string
  ) {
    closePostDetail();

    setEditingProfile(
      false
    );

    setViewingSavedPosts(
      false
    );

    setViewingBlockedUsers(
      false
    );

    resetSearchFlow();

    if (
      userId ===
      currentUserId
    ) {
      setSelectedProfileUserId(
        null
      );

      setTab(
        "profile"
      );

      return;
    }

    setSelectedProfileUserId(
      userId
    );
  }

  function closeUserProfile() {
    closePostDetail();

    setSelectedProfileUserId(
      null
    );
  }

  function openProfileEditor() {
    closePostDetail();

    setSelectedProfileUserId(
      null
    );

    setViewingSavedPosts(
      false
    );

    setViewingBlockedUsers(
      false
    );

    setEditingProfile(
      true
    );

    setTab(
      "profile"
    );
  }

  function closeProfileEditor() {
    setEditingProfile(
      false
    );
  }

  function handleProfileSaved() {
    setEditingProfile(
      false
    );

    setSelectedProfileUserId(
      null
    );

    setViewingSavedPosts(
      false
    );

    setViewingBlockedUsers(
      false
    );

    setTab(
      "profile"
    );
  }

  function openSavedPosts() {
    closePostDetail();

    setEditingProfile(
      false
    );

    setSelectedProfileUserId(
      null
    );

    setViewingSavedPosts(
      true
    );

    setViewingBlockedUsers(
      false
    );

    setTab(
      "profile"
    );
  }

  function closeSavedPosts() {
    closePostDetail();

    setViewingSavedPosts(
      false
    );

    setTab(
      "profile"
    );
  }

  function openBlockedUsers() {
    closePostDetail();

    setEditingProfile(
      false
    );

    setSelectedProfileUserId(
      null
    );

    setViewingSavedPosts(
      false
    );

    setViewingBlockedUsers(
      true
    );

    setTab(
      "profile"
    );
  }

  function closeBlockedUsers() {
    closePostDetail();

    setViewingBlockedUsers(
      false
    );

    setTab(
      "profile"
    );
  }

  function handlePostUpdated(
    post: Post
  ) {
    setEditingPostId(
      null
    );

    setSelectedPostId(
      post.id
    );
  }

  function handlePostDeleted() {
    setEditingPostId(
      null
    );

    setSelectedPostId(
      null
    );

    setSelectedProfileUserId(
      null
    );

    setEditingProfile(
      false
    );

    setViewingSavedPosts(
      false
    );

    setViewingBlockedUsers(
      false
    );

    resetSearchFlow();

    setTab(
      "profile"
    );
  }

  function openToday() {
    closePostDetail();

    setSelectedProfileUserId(
      null
    );

    setEditingProfile(
      false
    );

    setViewingSavedPosts(
      false
    );

    setViewingBlockedUsers(
      false
    );

    resetSearchFlow();

    setTab(
      "today"
    );
  }

  function openSearch() {
    closePostDetail();

    setSelectedProfileUserId(
      null
    );

    setEditingProfile(
      false
    );

    setViewingSavedPosts(
      false
    );

    setViewingBlockedUsers(
      false
    );

    resetSearchFlow();

    setTab(
      "search"
    );
  }

  function openCommunity() {
    closePostDetail();

    setSelectedProfileUserId(
      null
    );

    setEditingProfile(
      false
    );

    setViewingSavedPosts(
      false
    );

    setViewingBlockedUsers(
      false
    );

    resetSearchFlow();

    setTab(
      "community"
    );
  }

  function openNotifications() {
    closePostDetail();

    setSelectedProfileUserId(
      null
    );

    setEditingProfile(
      false
    );

    setViewingSavedPosts(
      false
    );

    setViewingBlockedUsers(
      false
    );

    resetSearchFlow();

    setTab(
      "notifications"
    );
  }

  function openProfile() {
    closePostDetail();

    setSelectedProfileUserId(
      null
    );

    setEditingProfile(
      false
    );

    setViewingSavedPosts(
      false
    );

    setViewingBlockedUsers(
      false
    );

    resetSearchFlow();

    setTab(
      "profile"
    );
  }

  function openSaunaDetail(
    sauna: Sauna
  ) {
    closePostDetail();

    setSelectedProfileUserId(
      null
    );

    setEditingProfile(
      false
    );

    setViewingSavedPosts(
      false
    );

    setViewingBlockedUsers(
      false
    );

    setSelectedSauna(
      sauna
    );

    setCreatedPost(
      null
    );

    setSearchView(
      "detail"
    );

    setTab(
      "search"
    );
  }

  const shouldHideTabBar =
    searchView ===
      "create-post" ||
    selectedPostId !==
      null ||
    editingPostId !==
      null ||
    selectedProfileUserId !==
      null ||
    editingProfile ||
    viewingSavedPosts ||
    viewingBlockedUsers;

  return (
    <div className="app-shell">
      <NotificationRealtimeSync
        userId={
          currentUserId
        }
        onUnreadCountChange={
          setUnreadNotificationCount
        }
      />

      <main className="app-content">
        {editingProfile ? (
          <EditProfileScreen
            userId={
              currentUserId
            }
            onBack={
              closeProfileEditor
            }
            onSaved={
              handleProfileSaved
            }
          />
        ) : editingPostId ? (
          <EditPostScreen
            postId={
              editingPostId
            }
            userId={
              currentUserId
            }
            onBack={
              closePostEditor
            }
            onUpdated={
              handlePostUpdated
            }
            onDeleted={
              handlePostDeleted
            }
          />
        ) : selectedPostId ? (
          <PostDetailScreen
            postId={
              selectedPostId
            }
            currentUserId={
              currentUserId
            }
            onBack={
              closePostDetail
            }
            onEdit={
              openPostEditor
            }
            onSelectSauna={
              openSaunaDetail
            }
            onSelectUser={
              openUserProfile
            }
          />
        ) : viewingSavedPosts ? (
          <SavedPostsScreen
            userId={
              currentUserId
            }
            onBack={
              closeSavedPosts
            }
            onSelectPost={
              openPostDetail
            }
          />
        ) : viewingBlockedUsers ? (
          <BlockedUsersScreen
            currentUserId={
              currentUserId
            }
            onBack={
              closeBlockedUsers
            }
          />
        ) : selectedProfileUserId ? (
          <UserProfileScreen
            currentUserId={
              currentUserId
            }
            profileUserId={
              selectedProfileUserId
            }
            onBack={
              closeUserProfile
            }
            onSelectPost={
              openPostDetail
            }
          />
        ) : (
          <>
            {tab ===
              "today" ? (
              <TodayScreen
                userId={
                  currentUserId
                }
                onGoSearch={
                  openSearch
                }
                onSelectSauna={
                  openSaunaDetail
                }
                onSelectPost={
                  openPostDetail
                }
              />
            ) : null}

            {tab ===
              "search" ? (
              <>
                {searchView ===
                  "search" ? (
                  <SearchScreen
                    onSelectSauna={
                      openSaunaDetail
                    }
                  />
                ) : null}

                {searchView ===
                  "detail" &&
                selectedSauna ? (
                  <SaunaDetailScreen
                    sauna={
                      selectedSauna
                    }
                    userId={
                      currentUserId
                    }
                    onBack={() => {
                      setSearchView(
                        "search"
                      );
                    }}
                    onCreatePost={() => {
                      setSearchView(
                        "create-post"
                      );
                    }}
                  />
                ) : null}

                {searchView ===
                  "create-post" &&
                selectedSauna ? (
                  <CreatePostScreen
                    sauna={
                      selectedSauna
                    }
                    userId={
                      currentUserId
                    }
                    onBack={() => {
                      setSearchView(
                        "detail"
                      );
                    }}
                    onCreated={(
                      post
                    ) => {
                      setCreatedPost(
                        post
                      );

                      setSearchView(
                        "post-complete"
                      );
                    }}
                  />
                ) : null}

                {searchView ===
                  "post-complete" &&
                selectedSauna &&
                createdPost ? (
                  <PostCompleteScreen
                    sauna={
                      selectedSauna
                    }
                    post={
                      createdPost
                    }
                    onViewPost={() => {
                      openPostDetail(
                        createdPost.id
                      );
                    }}
                    onBackToSauna={() => {
                      setSearchView(
                        "detail"
                      );
                    }}
                    onGoToday={
                      openToday
                    }
                  />
                ) : null}
              </>
            ) : null}

            {tab ===
              "community" ? (
              <CommunityScreen
                currentUserId={
                  currentUserId
                }
                onSelectPost={
                  openPostDetail
                }
                onSelectUser={
                  openUserProfile
                }
              />
            ) : null}

            {tab ===
              "notifications" ? (
              <NotificationsScreen
                currentUserId={
                  currentUserId
                }
                onSelectPost={
                  openPostDetail
                }
                onSelectUser={
                  openUserProfile
                }
                onUnreadCountChange={
                  setUnreadNotificationCount
                }
              />
            ) : null}

            {tab ===
              "profile" ? (
              <ProfileScreen
                userId={
                  currentUserId
                }
                email={
                  session.user
                    .email ??
                  null
                }
                onSelectPost={
                  openPostDetail
                }
                onEditProfile={
                  openProfileEditor
                }
                onOpenSavedPosts={
                  openSavedPosts
                }
                onOpenBlockedUsers={
                  openBlockedUsers
                }
              />
            ) : null}
          </>
        )}
      </main>

      {!shouldHideTabBar ? (
        <nav
          className="tab-bar"
          aria-label="メインナビゲーション"
        >
          <TabButton
            active={
              tab ===
              "today"
            }
            label="Today"
            onClick={
              openToday
            }
          >
            <Home />
          </TabButton>

          <TabButton
            active={
              tab ===
              "search"
            }
            label="探す"
            onClick={
              openSearch
            }
          >
            <Search />
          </TabButton>

          <TabButton
            active={
              tab ===
              "community"
            }
            label="みんな"
            onClick={
              openCommunity
            }
          >
            <UsersRound />
          </TabButton>

          <TabButton
            active={
              tab ===
              "notifications"
            }
            label="通知"
            badge={
              unreadNotificationCount
            }
            onClick={
              openNotifications
            }
          >
            <Bell />
          </TabButton>

          <TabButton
            active={
              tab ===
              "profile"
            }
            label="プロフィール"
            onClick={
              openProfile
            }
          >
            <UserRound />
          </TabButton>
        </nav>
      ) : null}
    </div>
  );
}

function LaunchScreen() {
  return (
    <section className="center-screen">
      <p className="eyebrow">
        TOTONO
      </p>

      <h1>
        サウナへ行く前から、
        整い始める。
      </h1>

      <p className="lead">
        あなたのサウナライフを、
        発見から記録までひとつに。
      </p>
    </section>
  );
}

function AuthInitializationErrorScreen({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <section className="center-screen">
      <p className="eyebrow">
        Connection
      </p>

      <h1>
        TOTONOを
        起動できませんでした
      </h1>

      <p className="lead">
        通信状態を確認して、
        もう一度お試しください。
      </p>

      <div
        className="card launch-error-card"
        role="alert"
      >
        <p>
          {message}
        </p>

        <button
          type="button"
          onClick={
            onRetry
          }
        >
          もう一度試す
        </button>
      </div>
    </section>
  );
}

function PostCompleteScreen({
  sauna,
  post,
  onViewPost,
  onBackToSauna,
  onGoToday,
}: {
  sauna: Sauna;
  post: Post;
  onViewPost: () => void;
  onBackToSauna: () => void;
  onGoToday: () => void;
}) {
  return (
    <section className="post-complete-screen">
      <div className="post-complete-icon">
        ✓
      </div>

      <p className="eyebrow">
        Recorded
      </p>

      <h1>
        サ活を記録しました
      </h1>

      <p className="lead">
        {sauna.name}
      </p>

      <div className="card">
        <strong>
          {post.set_count}
          セット
        </strong>

        <p>
          評価：
          {post.rating}.0 / 5.0
        </p>

        {post.comment ? (
          <p>
            {post.comment}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        className="post-submit-button"
        onClick={
          onViewPost
        }
      >
        投稿の詳細を見る
      </button>

      <button
        type="button"
        className="secondary"
        onClick={
          onGoToday
        }
      >
        Todayへ戻る
      </button>

      <button
        type="button"
        className="secondary"
        onClick={
          onBackToSauna
        }
      >
        施設詳細へ戻る
      </button>
    </section>
  );
}

function TabButton({
  active,
  label,
  badge = 0,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  badge?: number;
  onClick: () => void;
  children: ReactNode;
}) {
  const displayedBadge =
    badge > 99
      ? "99+"
      : badge;

  return (
    <button
      type="button"
      className={
        active
          ? "tab-button active"
          : "tab-button"
      }
      onClick={
        onClick
      }
      aria-current={
        active
          ? "page"
          : undefined
      }
    >
      <span className="tab-button-icon">
        {children}

        {badge > 0 ? (
          <span
            className="tab-button-badge"
            aria-label={`${badge}件の未読通知`}
          >
            {displayedBadge}
          </span>
        ) : null}
      </span>

      <span className="tab-button-label">
        {label}
      </span>
    </button>
  );
}
