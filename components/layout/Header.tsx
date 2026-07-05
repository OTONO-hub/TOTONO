export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <div className="text-xl font-bold text-blue-600">♨️ TOTONO</div>

        <nav className="flex gap-4 text-sm text-gray-600">
          <a href="#" className="hover:text-blue-600">
            ログイン
          </a>
          <a href="#" className="hover:text-blue-600">
            新規登録
          </a>
        </nav>
      </div>
    </header>
  );
}