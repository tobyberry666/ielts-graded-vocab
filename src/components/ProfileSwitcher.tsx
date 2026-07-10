// 顶栏档案切换器（本地多账号）。
// 显示当前激活档案头像 + 名称，展开后可在档案间切换，或新建 / 重命名 / 删除档案。
// 「注册 / 登录」在此落地为本地档案的创建 / 切换，无需任何后端。
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Profile } from '../repository/VocabRepository';

interface Props {
  profiles: Profile[];
  activeId: string;
  onSwitch: (id: string) => void;
  onCreate: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

function initial(name: string): string {
  const t = name.trim();
  return t ? t.slice(0, 1).toUpperCase() : '?';
}

export default function ProfileSwitcher({
  profiles,
  activeId,
  onSwitch,
  onCreate,
  onRename,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);
  const active = profiles.find((p) => p.id === activeId);
  const canDelete = profiles.length > 1;

  function handleCreate() {
    const name = window.prompt('新建档案名称（如：Tom / 室友 / 雅思冲刺）', '');
    if (name && name.trim()) onCreate(name.trim());
    setOpen(false);
  }

  function handleRename() {
    if (!active) return;
    const name = window.prompt('重命名档案', active.name);
    if (name && name.trim()) onRename(active.id, name.trim());
    setOpen(false);
  }

  function handleDelete() {
    if (!active || !canDelete) return;
    if (
      window.confirm(
        `确定删除档案「${active.name}」？其学习进度将一并清除，且不可恢复。`,
      )
    ) {
      onDelete(active.id);
    }
    setOpen(false);
  }

  return (
    <div className="profile-switcher">
      <button
        type="button"
        className="profile-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="profile-avatar" aria-hidden="true">
          {initial(active?.name ?? DEFAULT_FALLBACK)}
        </span>
        <span className="profile-name">{active?.name ?? '我的档案'}</span>
        <span className="profile-caret" aria-hidden="true">
          ▾
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="profile-menu glass"
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="profile-menu-label">学习档案</div>
            <ul className="profile-list">
              {profiles.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={p.id === activeId}
                    className={`profile-item${p.id === activeId ? ' is-active' : ''}`}
                    onClick={() => {
                      onSwitch(p.id);
                      setOpen(false);
                    }}
                  >
                    <span className="profile-avatar sm" aria-hidden="true">
                      {initial(p.name)}
                    </span>
                    <span className="profile-item-name">{p.name}</span>
                    {p.id === activeId && (
                      <span className="profile-check" aria-hidden="true">
                        ✓
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <div className="profile-menu-actions">
              <button type="button" className="profile-action" onClick={handleCreate}>
                ＋ 新建档案
              </button>
              <button
                type="button"
                className="profile-action"
                onClick={handleRename}
                disabled={!active}
              >
                ✎ 重命名
              </button>
              <button
                type="button"
                className="profile-action danger"
                onClick={handleDelete}
                disabled={!canDelete}
              >
                🗑 删除
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const DEFAULT_FALLBACK = '我的档案';
