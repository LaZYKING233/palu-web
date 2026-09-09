# 校园帕鲁 · 邮件模板库

招新、日常运营通知的 HTML 邮件模板。每个模板独立文件，命名规则见下方"命名规范"。

---

## 命名规范

`<场景>-<版本>.html`

- 场景：`welcome`（报名确认）/`invitation`（面试通知）/`result`（结果通知）/`reject`（婉拒）/`broadcast`（群发公告）等
- 版本：从 `v1` 起步，重大改版递增
- 示例：`welcome-v1.html`、`invitation-v1.html`

## 当前模板

| 文件 | 用途 | 状态 |
|---|---|---|
| `welcome.html` | 招新报名确认（同学提交报名表后自动回复） | ✅ v1 · 2026.9.7 |
| _后续按需添加_ | | |

---

## 视觉规范（沿用官网 `web/` 主题）

| 角色 | 颜色 | 备注 |
|---|---|---|
| 主色 | `#5BB5E9` | 图标天蓝色（帕鲁图标背景） |
| 主色深 | `#3A9BD1` | 链接 hover / 按钮深态 |
| 主色浅 | `#f4f9fc` | 卡片底色 / 高亮区 |
| 主色边框 | `rgb(91 181 233 / 22%)` | 卡片描边 |
| 文字主 | `#17151f` | 标题、正文 |
| 文字辅 | `#575362` | 段落次要信息 |
| 文字弱 | `#686572` | 辅助说明、caption |
| 文字标 | `#7a7584` | 占位提示 |
| 分割线 | `rgb(23 21 31 / 10%)` | 极细分割 |
| 页面底 | `#f4f5f7` | 邮件外层底 |
| 卡片底 | `#ffffff` | 主容器 |

### 字体栈（优先级顺序）

```
'HarmonyOS Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif         // 正文
'Source Han Serif SC', 'Songti SC', STSong, serif                          // 标题、签名
'SFMono-Regular', Consolas, 'Liberation Mono', monospace                   // 标签、英文、时间戳
```

### 圆角与边框

- 主容器：`border-radius: 4px`，外加 `1px solid rgb(23 21 31 / 12%)`
- 内嵌卡片：`border-radius: 4px`，外加 `1px solid` 主色浅（`rgb(91 181 233 / 22%)`）
- 按钮 / 胶囊：`border-radius: 999px`（仅当需要 CTA 按钮时使用，本次 `welcome.html` 无按钮）
- 顶部细线：`height: 3px; background: #5BB5E9`，强化品牌识别

### 字号

| 用途 | 字号 |
|---|---|
| 正文 | `14px` |
| 段落次要 / 卡片说明 | `13px` |
| 卡片小标题 / Footer 署名 | `16px` / `13px`（思源宋体） |
| 标题 / 品牌名 | `18px`（思源宋体） |
| Caption / 时间戳 / 英文标签 | `10–12px`（等宽字体） |
| 行高 | 正文 `1.7–1.85` |

---

## 图片引用规范（重要）

邮件客户端默认会**屏蔽外链图片**，所有图片必须用 **CID 内嵌**（作为附件嵌入）。

### HTML 写法

```html
<img src="cid:标识符" alt="说明" width="W" height="H" style="..." />
```

### 当前用到的图片

| CID 标识符 | 源文件 | 尺寸 | 用途 |
|---|---|---|---|
| `palu-logo` | `assets/palu-app-icon.png` | 36×36 | 左上角品牌 Logo（圆形） |
| `qrcode-group` | （待补：招新群二维码 PNG） | 112×112 | 招新群二维码 |

### 发邮件时如何嵌入 CID

以 QQ 邮箱 / Outlook / Gmail 为例：

1. 把图片作为**附件**添加到邮件
2. 在 HTML 里通过 `cid:xxx` 引用
3. 收件人看到的就是内联图片，不会被屏蔽

**Python 示例（`yagmail` / 标准 `email`）：**
```python
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
from email.mime.text import MIMEText

msg = MIMEMultipart('related')
msg['Subject'] = '校园帕鲁 · 报名确认'

html = open('welcome.html', 'r', encoding='utf-8').read()
msg.attach(MIMEText(html, 'html', 'utf-8'))

# 嵌入 logo
with open('../assets/palu-app-icon.png', 'rb') as f:
    logo = MIMEImage(f.read())
    logo.add_header('Content-ID', '<palu-logo>')
    msg.attach(logo)
```

---

## 兼容性与最佳实践

- ✅ **table + td 布局**（不用 div/flex/grid，Outlook 桌面端会崩）
- ✅ **内联 style**（`<style>` 块在 Gmail / 网页版 Outlook 会被部分剥离）
- ✅ **`role="presentation"`** 让屏幕阅读器正确识别
- ✅ **`<!--[if mso]>` 兜底 width**，处理 Outlook 怪异盒模型
- ✅ **移动端 viewport meta**（小屏表格自动收缩）
- ✅ **Preheader text**（藏在 `display:none` 里，控制邮件列表预览）
- ❌ 不用 CSS 动画 / transition
- ❌ 不用 JS
- ❌ 不用 background-image 装 CTA（Outlook 不支持）
- ❌ 不用 webfont 外链（除非自带 emoji 回退）
- ❌ 不用 SVG（部分客户端只显示为 alt 文字）

### 测试矩阵（建议每次发版前过一遍）

- QQ 邮箱（网页版 + Foxmail）
- 网易 163 / 126（网页版 + 客户端）
- Outlook（Windows 桌面 / macOS / Outlook.com 网页版）
- Gmail（网页版 + iOS / Android）
- iPhone Mail（iOS 16+）
- 小米 / 华为自带邮箱

---

## 维护说明

- 修改模板前确认影响范围；改主色 / 字体栈等视觉规范时同步更新本 README
- 视觉规范变更需同步检查 `web/` 官网主题（`styles.css`）是否需要跟进
- 模板版本通过文件名后缀管理（`welcome-v1.html` → `welcome-v2.html`），不删除旧文件以备回滚

---

*最后更新：2026.9.7 · 维护人：校园帕鲁工作室*
