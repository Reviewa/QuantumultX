/**
 * 破壳日 - 生日纪念日小组件
 *
 * 左侧头像（可选）+ 右侧环形进度 + 信息面板
 * - Small: 仅右侧信息面板（环形 + 昵称 + 年龄 + 农历 + 生日）
 * - Medium: 左侧头像 + 右侧信息
 * - Large: 左侧头像 + 右侧信息 + 底部一言
 *
 * 右上角装饰照片（圆形、可调大小、与圆环持平）
 */

import {
  Circle,
  Color,
  Device,
  HStack,
  Image,
  Spacer,
  Text,
  VStack,
  Widget,
  ZStack,
  fetch,
} from 'scripting'
import {
  solar2lunar,
  getNextBirthday,
  getAge,
  getMeetDays,
} from './lunar-calendar'

// ═══════════════════════════════════════════
//  颜色方案 — 自适应系统主题 + 用户自定义覆盖
// ═══════════════════════════════════════════

const isDark = Device.colorScheme === 'dark'

const ACCENT_COLOR: Color = '#fc5ead'
const RING_BG: Color = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'

// 默认颜色（自动适配深色/浅色）
function defaultColor(which: 'name' | 'age' | 'lunar' | 'quote'): Color {
  if (isDark) {
    switch (which) {
      case 'name':  return 'white'
      case 'age':   return 'rgba(255,255,255,0.7)'
      case 'lunar': return 'rgba(255,255,255,0.7)'
      case 'quote': return 'rgba(255,255,255,0.85)'
    }
  } else {
    switch (which) {
      case 'name':  return '#1a1a1a'
      case 'age':   return 'rgba(0,0,0,0.55)'
      case 'lunar': return 'rgba(0,0,0,0.55)'
      case 'quote': return 'rgba(0,0,0,0.6)'
    }
  }
}

// ═══════════════════════════════════════════
//  设置
// ═══════════════════════════════════════════

interface Settings {
  nickname: string
  birthday: string
  nongli: boolean
  eday: string
  bless: string
  avatarPath: string
  ringSize: number
  fontName: number
  fontAge: number
  fontLunar: number
  fontQuote: number
  fontMeetDays: number
  padding: number
  ringStroke: number
  colorName: string
  colorAge: string
  colorLunar: string
  colorQuote: string
  // 右上角装饰照片
  cornerPhotoPath: string
  cornerPhotoSize: number
  cornerPhotoOffsetX: number
  cornerPhotoOffsetY: number
}

interface UIConfig {
  ringSize: number
  fontName: number
  fontAge: number
  fontLunar: number
  fontQuote: number
  fontMeetDays: number
  padding: number
  ringStroke: number
  colorName: Color
  colorAge: Color
  colorLunar: Color
  colorQuote: Color
  cornerPhotoPath: string
  cornerPhotoSize: number
  cornerPhotoOffsetX: number
  cornerPhotoOffsetY: number
}

const DEFAULTS: Settings = {
  nickname: '小可爱',
  birthday: '2000-01-01',
  nongli: false,
  eday: '',
  bless: '',
  avatarPath: '',
  ringSize: 52,
  fontName: 16,
  fontAge: 11,
  fontLunar: 10,
  fontQuote: 10,
  fontMeetDays: 20,
  padding: 12,
  ringStroke: 2.5,
  colorName: '',
  colorAge: '',
  colorLunar: '',
  colorQuote: '',
  cornerPhotoPath: '',
  cornerPhotoSize: 52,
  cornerPhotoOffsetX: 8,
  cornerPhotoOffsetY: 0,
}

function loadSettings(): Settings {
  const saved = Storage.get<string>('birthday_settings')
  if (saved) {
    try { return { ...DEFAULTS, ...JSON.parse(saved) } } catch (_) {}
  }
  return { ...DEFAULTS }
}

function loadUIConfig(): UIConfig {
  const s = loadSettings()
  return {
    ringSize: s.ringSize,
    fontName: s.fontName,
    fontAge: s.fontAge,
    fontLunar: s.fontLunar,
    fontQuote: s.fontQuote,
    fontMeetDays: s.fontMeetDays,
    padding: s.padding,
    ringStroke: s.ringStroke,
    colorName: s.colorName ? (s.colorName as Color) : defaultColor('name'),
    colorAge: s.colorAge ? (s.colorAge as Color) : defaultColor('age'),
    colorLunar: s.colorLunar ? (s.colorLunar as Color) : defaultColor('lunar'),
    colorQuote: s.colorQuote ? (s.colorQuote as Color) : defaultColor('quote'),
    cornerPhotoPath: s.cornerPhotoPath,
    cornerPhotoSize: s.cornerPhotoSize,
    cornerPhotoOffsetX: s.cornerPhotoOffsetX,
    cornerPhotoOffsetY: s.cornerPhotoOffsetY,
  }
}

// ═══════════════════════════════════════════
//  一言 API（三源容灾）
// ═══════════════════════════════════════════

async function fetchQuote(): Promise<string> {
  const fallback = '愿你每一天都充满阳光～☀️'

  try {
    const res = await fetch('https://v1.hitokoto.cn/')
    const data: any = await res.json()
    if (data && data.hitokoto) return data.hitokoto
  } catch (_) {}

  try {
    const res = await fetch('https://api.btstu.cn/yan/api.php?charset=utf-8&encode=json')
    const data: any = await res.json()
    if (data && data.text) return data.text
  } catch (_) {}

  try {
    const res = await fetch('https://api.uomg.com/api/rand.qinghua?format=json')
    const data: any = await res.json()
    if (data && data.content) return data.content
  } catch (_) {}

  return fallback
}

// ═══════════════════════════════════════════
//  数据计算
// ═══════════════════════════════════════════

interface AgeResult {
  year: number
  month: number
  day: number
}

interface Data {
  nickname: string
  meetDays: number
  progressPercent: number
  daysUntilBirthday: number
  ageText: string
  lunarText: string
  nextBirthdayText: string
  bless: string
  avatarPath: string
}

function computeData(s: Settings): Data {
  const now = new Date()
  const [by, bm, bd] = s.birthday.split('-').map(Number)

  const age = getAge(s.birthday) as AgeResult
  const ageText = age.year > 0
    ? `${age.year}岁${age.month > 0 ? age.month + '月' : ''}`
    : age.month > 0
      ? `${age.month}月${age.day}天`
      : `${age.day}天`

  let lunarText = '--'
  try {
    const lunar = solar2lunar(now.getFullYear(), now.getMonth() + 1, now.getDate())
    lunarText = `${lunar.IMonthCn}${lunar.IDayCn}`
  } catch (_) {}

  const nextBirthday = getNextBirthday(by, bm, bd, s.nongli, false)
  const nextBirthdayText = nextBirthday
    ? `${nextBirthday.cYear}-${String(nextBirthday.cMonth).padStart(2, '0')}-${String(nextBirthday.cDay).padStart(2, '0')}`
    : '--'

  let progressPercent = 0
  let daysUntilBirthday = 0
  if (nextBirthday) {
    const nextDate = new Date(nextBirthday.cYear, nextBirthday.cMonth - 1, nextBirthday.cDay)
    const diffMs = nextDate.getTime() - now.getTime()
    daysUntilBirthday = Math.ceil(diffMs / 86400000)

    const lastBirthday = new Date(nextBirthday.cYear - 1, nextBirthday.cMonth - 1, nextBirthday.cDay)
    const yearMs = nextDate.getTime() - lastBirthday.getTime()
    const elapsedMs = now.getTime() - lastBirthday.getTime()
    progressPercent = Math.min(1, Math.max(0, elapsedMs / yearMs))
  }

  let meetDays = 0
  if (s.eday) {
    meetDays = getMeetDays(s.eday)
  }

  return {
    nickname: s.nickname || '小可爱',
    meetDays,
    progressPercent,
    daysUntilBirthday,
    ageText,
    lunarText,
    nextBirthdayText,
    bless: s.bless,
    avatarPath: s.avatarPath,
  }
}

// ═══════════════════════════════════════════
//  小组件视图组件
// ═══════════════════════════════════════════

/**
 * 环形进度条组件（仿原版：圆环 + 中心爱心图标 + 数字）
 */
function RingProgressView({
  size,
  stroke,
  progress,
  accentColor,
  daysUntil,
}: {
  size: number
  stroke: number
  progress: number
  accentColor: Color
  daysUntil: number
}) {
  return (
    <ZStack>
      {/* 背景环 */}
      <Circle
        stroke={{ shapeStyle: RING_BG, strokeStyle: { lineWidth: stroke } }}
        frame={{ width: size, height: size }}
      />
      {/* 进度环 */}
      <Circle
        trim={{ from: 0, to: progress }}
        stroke={{
          shapeStyle: accentColor,
          strokeStyle: { lineWidth: stroke, lineCap: 'round' },
        }}
        frame={{ width: size, height: size }}
      />
      {/* 中心圆形背景 */}
      <Circle
        fill={accentColor}
        frame={{ width: size - stroke - 10, height: size - stroke - 10 }}
      />
      {/* 中心内容：爱心 + 倒数天数 + 进度百分比 */}
      <VStack alignment="center" spacing={0}>
        <Text font={Math.round(size * 0.22)} foregroundStyle="white" multilineTextAlignment="center">
          ♥
        </Text>
        <Text font={Math.round(size * 0.3)} foregroundStyle="white" multilineTextAlignment="center">
          {daysUntil > 0 ? `${daysUntil}` : '🎉'}
        </Text>
        <Text font={Math.round(size * 0.12)} foregroundStyle={'rgba(255,255,255,0.8)' as Color} multilineTextAlignment="center">
          {Math.round(progress * 100)}%
        </Text>
      </VStack>
    </ZStack>
  )
}

/**
 * 信息行组件（图标 + 标签 + 值）
 */
function InfoRowView({
  icon,
  iconColor,
  label,
  value,
  textColor,
  fontSize,
}: {
  icon: string
  iconColor: Color
  label: string
  value: string
  textColor: Color
  fontSize: number
}) {
  return (
    <HStack alignment="center" spacing={4}>
      <Text font={fontSize} foregroundStyle={iconColor} frame={{ width: 22, alignment: 'center' }}>
        {icon}
      </Text>
      <Text font={fontSize} foregroundStyle={textColor}>
        {label}
      </Text>
      <Spacer />
      <Text font={fontSize} foregroundStyle={textColor} lineLimit={1}>
        {value}
      </Text>
    </HStack>
  )
}

/**
 * 右侧信息面板（原版样式）
 * - 顶部：昵称 + 相识天数
 * - 中间：环形进度（倒数天数）
 * - 信息行：年龄 / 农历 / 下次生日
 */
function RightPanelView({
  data,
  ui,
}: {
  data: Data
  ui: UIConfig
}) {
  return (
    <VStack spacing={4} alignment="leading">
      {/* 昵称 + 相识天数（同一行） */}
      <HStack alignment="center" spacing={6}>
        <Text font={ui.fontName} foregroundStyle={ui.colorName}>
          {data.nickname}
        </Text>
        {data.meetDays > 0 && (
          <Text
            font={ui.fontMeetDays}
            foregroundStyle={ui.colorName}
          >
            {data.meetDays}
          </Text>
        )}
      </HStack>

      {/* 环形进度 + 装饰照片 — 同一行，上下持平 */}
      <HStack alignment="center" spacing={6 + ui.cornerPhotoOffsetX}>
        <RingProgressView
          size={ui.ringSize}
          stroke={ui.ringStroke}
          progress={data.progressPercent}
          accentColor={ACCENT_COLOR}
          daysUntil={data.daysUntilBirthday}
        />
        {ui.cornerPhotoPath ? (
          <VStack alignment="center" padding={{ top: ui.cornerPhotoOffsetY }}>
            <Image
              filePath={ui.cornerPhotoPath}
              frame={{ width: ui.cornerPhotoSize, height: ui.cornerPhotoSize }}
              clipShape={{ type: 'rect', cornerRadius: Math.round(ui.cornerPhotoSize / 2) }}
              resizable
            />
          </VStack>
        ) : null}
      </HStack>

      {/* 信息行 */}
      <InfoRowView
        icon="⏳"
        iconColor="#1ab6f8"
        label="年龄"
        value={data.ageText}
        textColor={ui.colorAge}
        fontSize={ui.fontAge}
      />
      <InfoRowView
        icon="📅"
        iconColor="#30d15b"
        label="农历"
        value={data.lunarText}
        textColor={ui.colorLunar}
        fontSize={ui.fontLunar}
      />
      <InfoRowView
        icon="🎁"
        iconColor="#fc6d6d"
        label="生日"
        value={data.nextBirthdayText}
        textColor={ui.colorLunar}
        fontSize={ui.fontLunar}
      />
    </VStack>
  )
}

/**
 * 左侧头像面板（仿原版：图片作为背景 + 底部寄语横幅）
 */
function LeftPanelView({
  avatarPath,
  bless,
}: {
  avatarPath: string
  bless: string
}) {
  const bgColor: Color = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'

  return (
    <VStack
      frame={{ width: 150, height: 'infinity' as any }}
      alignment="center"
      spacing={0}
    >
      {avatarPath ? (
        <Image
          filePath={avatarPath}
          resizable
          frame={{ width: 150, height: 'infinity' as any }}
        />
      ) : (
        <VStack
          frame={{ width: 150, height: 'infinity' as any }}
          alignment="center"
          background={bgColor}
        >
          <Text font={40} foregroundStyle={'rgba(128,128,128,0.4)' as Color} multilineTextAlignment="center">
            🎂
          </Text>
        </VStack>
      )}
      {bless ? (
        <HStack
          frame={{ width: 150, height: 26 }}
          alignment="center"
          background={ACCENT_COLOR}
        >
          <Text
            font={11}
            foregroundStyle="rgba(255,255,255,0.8)"
            multilineTextAlignment="center"
          >
            ✿ {bless} ✿
          </Text>
        </HStack>
      ) : null}
    </VStack>
  )
}

// ═══════════════════════════════════════════
//  主组件
// ═══════════════════════════════════════════

let quoteText = ''

function WidgetView() {
  const settings = loadSettings()
  const ui = loadUIConfig()
  const data = computeData(settings)

  const isSmall = Widget.family === 'systemSmall'
  const isLarge = Widget.family === 'systemLarge'

  return (
    <ZStack>
      {/* 主内容区域 */}
      <HStack
        padding={ui.padding}
        spacing={10}
        alignment="top"
      >
        {/* 左侧头像 — medium/large */}
        {!isSmall ? (
          <LeftPanelView
            avatarPath={data.avatarPath}
            bless={data.bless}
          />
        ) : null}

        {/* 右侧信息面板 */}
        <RightPanelView
          data={data}
          ui={ui}
        />
      </HStack>



      {/* 底部一言 — large 尺寸 */}
      {isLarge ? (
        <VStack
          frame={{ width: 'infinity' as any, height: 'infinity' as any }}
          alignment="leading"
        >
          <Spacer />
          <Text
            font={ui.fontQuote}
            foregroundStyle={ui.colorQuote}
            multilineTextAlignment="leading"
          >
            {quoteText}
          </Text>
        </VStack>
      ) : null}
    </ZStack>
  )
}

// ═══════════════════════════════════════════
//  入口
// ═══════════════════════════════════════════

async function main() {
  // 异步获取一言（仅 large 需要）
  if (Widget.family === 'systemLarge') {
    quoteText = await fetchQuote()
  }
  // 每日凌晨 0 点自动刷新
  const now = new Date()
  const nextMidnight = new Date(
    now.getFullYear(), now.getMonth(), now.getDate() + 1,
    0, 0, 0
  )
  Widget.present(<WidgetView />, {
    reloadPolicy: { policy: 'after', date: nextMidnight }
  })
}

main()
