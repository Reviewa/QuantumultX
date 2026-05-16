import { VStack, HStack, Text, Image, Spacer, Widget, fetch, modifiers } from 'scripting'

const lengthThreshold = 5

const CONFIG_PATH = FileManager.appGroupDocumentsDirectory + '/bottom_bar_config.json'

const barColor = { light: '#8C7CFF', dark: '#00C400' } as const
const defaultBgColor = {
  light: 'rgba(239,235,233,0.6)',
  dark: 'rgba(22,29,42,0.5)'
} as const
const labelColor = {
  light: 'rgba(0,0,0,0.45)',
  dark: 'rgba(255,255,255,0.45)'
} as const
const textColor = {
  light: 'rgba(0,0,0,0.7)',
  dark: 'rgba(255,255,255,0.7)'
} as const
const strongColor = {
  light: 'rgba(0,0,0,0.85)',
  dark: 'rgba(255,255,255,0.85)'
} as const

interface Config {
  weatherBgColor: string | null
  contentBgColor: string | null
}

function loadConfig(): Config {
  try {
    const content = FileManager.readAsStringSync(CONFIG_PATH)
    return content ? JSON.parse(content) : { weatherBgColor: null, contentBgColor: null }
  } catch {
    return { weatherBgColor: null, contentBgColor: null }
  }
}

function getCurrentTimeString(): string {
  const now = new Date()
  return [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0')
  ].join(':')
}

function conditionToChinese(condition: WeatherCondition): string {
  const map: Record<string, string> = {
    blizzard: '暴风雪', blowingDust: '扬尘', blowingSnow: '吹雪',
    breezy: '微风', clear: '晴', cloudy: '多云',
    drizzle: '小雨', flurries: '小雪', foggy: '雾',
    freezingDrizzle: '冻雨', freezingRain: '冻雨',
    frigid: '严寒', hail: '冰雹', haze: '霾',
    heavyRain: '大雨', heavySnow: '大雪', hot: '炎热',
    hurricane: '飓风', isolatedThunderstorms: '局部雷阵雨',
    mostlyClear: '晴', mostlyCloudy: '多云',
    partlyCloudy: '多云', rain: '雨',
    scatteredThunderstorms: '零星雷阵雨', sleet: '雨夹雪',
    smoky: '烟霾', snow: '雪', strongStorms: '强风暴',
    sunFlurries: '太阳雪', sunShowers: '太阳雨',
    thunderstorms: '雷暴', tropicalStorm: '热带风暴',
    windy: '大风', wintryMix: '冻雨'
  }
  return map[condition] ?? condition
}

const SOLAR_TERM_NAMES = [
  '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
  '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
  '立冬', '小雪', '大雪', '冬至', '小寒', '大寒'
]

const BASE_DATES: [number, number][] = [
  [1, 3.5], [1, 18.7],
  [2, 5.6], [2, 20.7],
  [3, 4.8], [3, 20.1],
  [4, 5.5], [4, 21.1],
  [5, 5.7], [5, 21.4],
  [6, 7.1], [6, 22.8],
  [7, 7.5], [7, 23.1],
  [8, 7.7], [8, 23.0],
  [9, 8.3], [9, 23.5],
  [10, 7.4], [10, 22.3],
  [11, 6.9], [11, 21.8],
  [0, 5.6], [0, 20.4]
]

function calcSolarTermDate(year: number, index: number): Date {
  const [month, baseDay] = BASE_DATES[index]
  const correction = (year - 2000) * 0.006
  return new Date(year, month, Math.floor(baseDay + correction))
}

interface SolarTermInfo {
  name: string
  date: Date
  daysUntil: number
  hoursUntil: number
  dayOfWeek: string
  formattedDate: string
}

function getUpcomingSolarTerms(): SolarTermInfo[] {
  const now = new Date()
  const year = now.getFullYear()
  const results: SolarTermInfo[] = []
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  for (const y of [year, year + 1]) {
    for (let i = 0; i < 24; i++) {
      const date = calcSolarTermDate(y, i)
      const diffMs = date.getTime() - now.getTime()
      const daysUntil = diffMs / (1000 * 60 * 60 * 24)

      if (daysUntil >= -3) {
        results.push({
          name: SOLAR_TERM_NAMES[i],
          date,
          daysUntil: Math.floor(daysUntil),
          hoursUntil: Math.floor(diffMs / (1000 * 60 * 60)),
          dayOfWeek: dayNames[date.getDay()],
          formattedDate: `${date.getMonth() + 1}月${date.getDate()}日`
        })
      }
    }
  }

  results.sort((a, b) => a.date.getTime() - b.date.getTime())
  return results.slice(0, 2)
}

interface OneWordResponse {
  content: string
  note: string
  fenxiang_img: string
}

async function getOneWord(): Promise<OneWordResponse | null> {
  try {
    const resp = await fetch('https://open.iciba.com/dsapi')
    if (!resp.ok) return null
    return resp.json()
  } catch {
    return null
  }
}

interface WidgetData {
  currentTime: string
  currentWeather: CurrentWeather | null
  oneWord: OneWordResponse | null
  solarTerms: SolarTermInfo[]
}

async function fetchWidgetData(): Promise<WidgetData> {
  let currentWeather: CurrentWeather | null = null

  try {
    const loc = await Location.requestCurrent()
    if (loc) {
      currentWeather = await Weather.requestCurrent({
        latitude: loc.latitude,
        longitude: loc.longitude
      })
    }
  } catch (e) {
    console.error('位置/天气获取失败:', e)
  }

  const oneWord = await getOneWord()
  const solarTerms = getUpcomingSolarTerms()

  return {
    currentTime: getCurrentTimeString(),
    currentWeather,
    oneWord,
    solarTerms
  }
}

function DaysEmoji({ days }: { days: number }) {
  const emoji = days <= 0 ? '🔥' : days <= 3 ? '🌱' : days <= 10 ? '🌿' : days <= 30 ? '🌳' : '🗓️'
  return <Text font={24}>{emoji}</Text>
}

function SolarTermsContent({ solarTerms }: { solarTerms: SolarTermInfo[] }) {
  const first = solarTerms[0]
  const second = solarTerms[1]

  return (
    <HStack alignment="center" frame={{ maxWidth: 'infinity' }}>
      <Spacer />

      {first && <DaysEmoji days={first.daysUntil} />}
      <Spacer minLength={8} />

      <VStack alignment="leading" spacing={2}>
        {first && (
          <Text font={13} foregroundStyle={strongColor}>
            {`${first.name} - ${first.formattedDate} ${first.dayOfWeek}`}
            {first.daysUntil < 0
              ? `，第 ${-first.daysUntil} 天`
              : first.hoursUntil <= 24
                ? `，还有 ${first.hoursUntil} 小时`
                : `，还有 ${first.daysUntil} 天`}
          </Text>
        )}
        {second && (
          <Text font={12} foregroundStyle={labelColor}>
            {`${second.name} - ${second.formattedDate} ${second.dayOfWeek}`}
            {`，还有 ${second.daysUntil} 天`}
          </Text>
        )}
      </VStack>

      <Spacer />

      <VStack alignment="center" spacing={0}>
        <Text font={32} fontWeight="bold" foregroundStyle={barColor}>
          {first && first.daysUntil > 0 ? String(first.daysUntil) : '0'}
        </Text>
        <Text font={10} foregroundStyle={labelColor}>
          天
        </Text>
      </VStack>

      <Spacer />
    </HStack>
  )
}

function OneWordContent({ text }: { text: string }) {
  return (
    <HStack alignment="center" frame={{ maxWidth: 'infinity' }}>
      <Spacer />
      <Text
        font={12.5}
        foregroundStyle={strongColor}
        frame={{ maxWidth: 'infinity' }}
        lineLimit={3}
      >
        {text}
      </Text>
      <Spacer />
    </HStack>
  )
}

function TemperatureBar({ value }: { value: number }) {
  const height = Math.min(Math.max(Math.abs(value) * 2.5, 16), 44)
  return (
    <VStack alignment="center" spacing={2}>
      <Text font={11} foregroundStyle={strongColor} fontWeight="medium">
        {Math.round(value)}°
      </Text>
      <VStack
        frame={{ width: 4, height }}
        background={{
          style: barColor,
          shape: { type: 'rect', cornerRadius: 2 }
        }}
      />
    </VStack>
  )
}

function BottomBarWidget({
  data,
  weatherBg,
  contentBg
}: {
  data: WidgetData
  weatherBg: string | null
  contentBg: string | null
}) {
  const { currentWeather, currentTime, oneWord, solarTerms } = data
  const hasWeather = currentWeather !== null

  const note = oneWord?.note ?? ''
  const content = oneWord?.content ?? ''
  const combinedText = note && content ? `${note} ${content}` : (note || content || '')
  const showSolarTerms = combinedText.length < lengthThreshold

  const weatherBgStyle = weatherBg !== null
    ? weatherBg as any
    : defaultBgColor
  const contentBgStyle = contentBg !== null
    ? contentBg as any
    : defaultBgColor

  return (
    <VStack
      padding={{ leading: 16, trailing: 16, top: 12, bottom: 12 }}
      frame={{ maxWidth: 'infinity', maxHeight: 'infinity' }}
      spacing={10}
    >
      <HStack
        alignment="center"
        padding={{ leading: 16, trailing: 18, top: 12, bottom: 12 }}
        background={{
          style: weatherBgStyle,
          shape: { type: 'rect', cornerRadius: 23 }
        }}
      >
        <Image
          systemName={currentWeather?.symbolName ?? 'cloud.fill'}
          font={38}
          foregroundStyle={barColor}
          frame={{ width: 38, height: 38 }}
        />

        <Spacer minLength={10} />

        <VStack alignment="leading" spacing={2}>
          <HStack alignment="center" spacing={6}>
            <Text font={14} foregroundStyle={barColor} fontWeight="bold">
              {hasWeather
                ? conditionToChinese(currentWeather!.condition)
                : '--'}
            </Text>

            {hasWeather && (
              <TemperatureBar
                value={currentWeather!.temperature.value}
              />
            )}

            <Spacer />

            <Text font={14} foregroundStyle={labelColor}>
              {currentTime}
            </Text>
          </HStack>

          <Text font={13} foregroundStyle={textColor}>
            {hasWeather
              ? `${currentWeather!.temperature.formatted}  体感 ${currentWeather!.apparentTemperature.formatted}`
              : '加载天气数据...'}
          </Text>
        </VStack>
      </HStack>

      <HStack
        alignment="center"
        padding={{ leading: 18, trailing: 18, top: 12, bottom: 12 }}
        background={{
          style: contentBgStyle,
          shape: { type: 'rect', cornerRadius: 23 }
        }}
      >
        {showSolarTerms && solarTerms.length > 0 ? (
          <SolarTermsContent solarTerms={solarTerms} />
        ) : (
          <OneWordContent text={combinedText} />
        )}
      </HStack>
    </VStack>
  )
}

async function main() {
  const data = await fetchWidgetData()
  const config = loadConfig()

  if (data.currentWeather) {
    console.log(
      `天气: ${data.currentWeather.condition}, ` +
      `温度: ${data.currentWeather.temperature.formatted}`
    )
  }

  Widget.present(
    <BottomBarWidget
      data={data}
      weatherBg={config.weatherBgColor}
      contentBg={config.contentBgColor}
    />,
    {
      policy: 'after',
      date: new Date(Date.now() + 30 * 60 * 1000)
    }
  )
}

main()
