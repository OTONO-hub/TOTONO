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
  BookOpen,
  CirclePlus,
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
  JournalScreen,
} from "./screens/JournalScreen";
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
  PostStartScreen,
} from "./screens/PostStartScreen";
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
import {
  createManualPostSauna,
  createPostSaunaFromSauna,
  type PostSauna,
} from "./types/post-sauna";
import type {
  Post,
} from "./types/post";

type Tab =
  | "today"
  | "search"
  | "create"
  | "community"
  | "journal"
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

  /*
   * 施設詳細画面で使用する、
   * saunasテーブルに登録済みの施設です。
   */
  const [
    selectedSauna,
    setSelectedSauna,
  ] =
    useState<Sauna | null>(
      null
    );

  /*
   * 投稿画面で使用する施設情報です。
   *
   * 登録済み施設の場合はidを持ち、
   * 手入力施設の場合はidがnullになります。
   */
  const [
    selectedPostSauna,
    setSelectedPostSauna,
  ] =
    useState<PostSauna | null>(
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

    setSelectedPostSauna(
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

  function resetProfileFlows() {
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
  }

  function openUserProfile(
    userId: string
  ) {
    closePostDetail();

    resetProfileFlows();

    resetSearchFlow();

    if (
      userId ===
      currentUserId
    ) {
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

    resetProfileFlows();

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
    resetProfileFlows();

    setTab(
      "profile"
    );
  }

  function openSavedPosts() {
    closePostDetail();

    resetProfileFlows();

    setViewingSavedPosts(
      true
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

    resetProfileFlows();

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
    closePostDetail();

    resetProfileFlows();

    resetSearchFlow();

    setTab(
      "journal"
    );
  }

  function openToday() {
    closePostDetail();

    resetProfileFlows();

    resetSearchFlow();

    setTab(
      "today"
    );
  }

  function openSearch() {
    closePostDetail();

    resetProfileFlows();

    resetSearchFlow();

    setTab(
      "search"
    );
  }

  function openCreatePostFlow() {
    closePostDetail();

    resetProfileFlows();

    resetSearchFlow();

    setTab(
      "create"
    );
  }

  function openCommunity() {
    closePostDetail();

    resetProfileFlows();

    resetSearchFlow();

    setTab(
      "community"
    );
  }

  function openJournal() {
    closePostDetail();

    resetProfileFlows();

    resetSearchFlow();

    setTab(
      "journal"
    );
  }

  function openNotifications() {
    closePostDetail();

    resetProfileFlows();

    resetSearchFlow();

    setTab(
      "notifications"
    );
  }

  function openProfile() {
    closePostDetail();

    resetProfileFlows();

    resetSearchFlow();

    setTab(
      "profile"
    );
  }

  function openSaunaDetail(
    sauna: Sauna
  ) {
    closePostDetail();

    resetProfileFlows();

    setSelectedSauna(
      sauna
    );

    setSelectedPostSauna(
      null
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

  function selectSaunaFromSearch(
    sauna: Sauna
  ) {
    setSelectedSauna(
      sauna
    );

    setCreatedPost(
      null
    );

    if (
      tab ===
      "create"
    ) {
      setSelectedPostSauna(
        createPostSaunaFromSauna(
          sauna
        )
      );

      setSearchView(
        "create-post"
      );

      return;
    }

    setSelectedPostSauna(
      null
    );

    setSearchView(
      "detail"
    );
  }

  function selectManualSauna(
    saunaName: string
  ) {
    try {
      const manualSauna =
        createManualPostSauna(
          saunaName
        );

      setSelectedSauna(
        null
      );

      setSelectedPostSauna(
        manualSauna
      );

      setCreatedPost(
        null
      );

      setSearchView(
        "create-post"
      );

      setTab(
        "create"
      );
    } catch (
      manualSaunaError
    ) {
      console.error(
        "未登録施設を選択できませんでした。",
        manualSaunaError
      );
    }
  }

  function startPostFromSaunaDetail() {
    if (!selectedSauna) {
      return;
    }

    setSelectedPostSauna(
      createPostSaunaFromSauna(
        selectedSauna
      )
    );

    setCreatedPost(
      null
    );

    setSearchView(
      "create-post"
    );
  }

  function closeCreatePostScreen() {
    setCreatedPost(
      null
    );

    setSelectedPostSauna(
      null
    );

    if (
      tab ===
        "search" &&
      selectedSauna
    ) {
      setSearchView(
        "detail"
      );

      return;
    }

    setSelectedSauna(
      null
    );

    setSearchView(
      "search"
    );
  }

  function finishCreatedPost(
    post: Post
  ) {
    setCreatedPost(
      post
    );

    setSearchView(
      "post-complete"
    );
  }

  const isNestedSearchView =
    searchView !==
    "search";

  const shouldHideNavigation =
    isNestedSearchView ||
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

      {!shouldHideNavigation ? (
        <header className="app-top-bar">
          <button
            type="button"
            className="app-brand-button"
            onClick={
              openToday
            }
            aria-label="ホームを開く"
          >
            TOTONO
          </button>

          <div className="app-top-actions">
            <button
              type="button"
              className={
                tab ===
                "notifications"
                  ? "app-top-action active"
                  : "app-top-action"
              }
              onClick={
                openNotifications
              }
              aria-label={
                unreadNotificationCount >
                0
                  ? `通知を開く。未読${unreadNotificationCount}件`
                  : "通知を開く"
              }
            >
              <Bell
                aria-hidden="true"
              />

              {unreadNotificationCount >
              0 ? (
                <span className="app-top-action-badge">
                  {unreadNotificationCount >
                  99
                    ? "99+"
                    : unreadNotificationCount}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              className={
                tab ===
                "profile"
                  ? "app-top-action active"
                  : "app-top-action"
              }
              onClick={
                openProfile
              }
              aria-label="プロフィールを開く"
            >
              <UserRound
                aria-hidden="true"
              />
            </button>
          </div>
        </header>
      ) : null}

      <main
        className={
          shouldHideNavigation
            ? "app-content"
            : "app-content app-content-with-top-bar"
        }
      >
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
                "search" ||
              tab ===
                "create" ? (
              <>
                {searchView ===
                    "search" &&
                  tab ===
                    "search" ? (
                  <SearchScreen
                    onSelectSauna={
                      selectSaunaFromSearch
                    }
                  />
                ) : null}

                {searchView ===
                    "search" &&
                  tab ===
                    "create" ? (
                  <PostStartScreen
                    onSelectSauna={
                      selectSaunaFromSearch
                    }
                    onSelectManualSauna={
                      selectManualSauna
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
                    onCreatePost={
                      startPostFromSaunaDetail
                    }
                  />
                ) : null}

                {searchView ===
                  "create-post" &&
                selectedPostSauna ? (
                  <CreatePostScreen
                    sauna={
                      selectedPostSauna
                    }
                    userId={
                      currentUserId
                    }
                    onBack={
                      closeCreatePostScreen
                    }
                    onCreated={
                      finishCreatedPost
                    }
                  />
                ) : null}

                {searchView ===
                  "post-complete" &&
                selectedPostSauna &&
                createdPost ? (
                  <PostCompleteScreen
                    sauna={
                      selectedPostSauna
                    }
                    post={
                      createdPost
                    }
                    onViewPost={() => {
                      openPostDetail(
                        createdPost.id
                      );
                    }}
                    onBackToSauna={
                      selectedSauna
                        ? () => {
                            setTab(
                              "search"
                            );

                            setSelectedPostSauna(
                              null
                            );

                            setSearchView(
                              "detail"
                            );
                          }
                        : undefined
                    }
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
              "journal" ? (
              <JournalScreen
                userId={
                  currentUserId
                }
                onSelectPost={
                  openPostDetail
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

      {!shouldHideNavigation ? (
        <nav
          className="tab-bar"
          aria-label="メインナビゲーション"
        >
          <TabButton
            active={
              tab ===
              "today"
            }
            label="ホーム"
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
              "create"
            }
            label="投稿"
            emphasized
            onClick={
              openCreatePostFlow
            }
          >
            <CirclePlus />
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
              "journal"
            }
            label="ジャーナル"
            onClick={
              openJournal
            }
          >
            <BookOpen />
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
  sauna: PostSauna;
  post: Post;
  onViewPost: () => void;
  onBackToSauna?: () => void;
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
          {post.rating.toFixed(
            1
          )}{" "}
          / 5.0
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
        ホームへ戻る
      </button>

      {onBackToSauna ? (
        <button
          type="button"
          className="secondary"
          onClick={
            onBackToSauna
          }
        >
          施設詳細へ戻る
        </button>
      ) : null}
    </section>
  );
}

function TabButton({
  active,
  label,
  badge = 0,
  emphasized = false,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  badge?: number;
  emphasized?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const displayedBadge =
    badge > 99
      ? "99+"
      : badge;

  const classNames = [
    "tab-button",

    active
      ? "active"
      : "",

    emphasized
      ? "tab-button-emphasized"
      : "",
  ]
    .filter(
      Boolean
    )
    .join(
      " "
    );

  return (
    <button
      type="button"
      className={
        classNames
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
