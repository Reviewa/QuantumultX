/**
 * 破壳日 - 设置界面
 *
 * 运行此脚本可设置生日信息、上传照片、调节样式并保存设置
 * 每个调节按钮均已标注清楚作用
 */

import {
  Button,
  Color,
  ColorPicker,
  HStack,
  Image,
  List,
  Navigation,
  NavigationStack,
  Script,
  Section,
  Slider,
  Spacer,
  Text,
  TextField,
  Toggle,
} from 'scripting'

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

function saveSettings(s: Settings) {
  Storage.set('birthday_settings', JSON.stringify(s))
}

function SettingsPage() {
  const dismiss = Navigation.useDismiss()

  let nickname = DEFAULTS.nickname
  let birthday = DEFAULTS.birthday
  let nongli = false
  let eday = ''
  let bless = ''
  let avatarPath = ''
  let ringSize = DEFAULTS.ringSize
  let fontName = DEFAULTS.fontName
  let fontAge = DEFAULTS.fontAge
  let fontLunar = DEFAULTS.fontLunar
  let fontQuote = DEFAULTS.fontQuote
  let fontMeetDays = DEFAULTS.fontMeetDays
  let padding = DEFAULTS.padding
  let ringStroke = DEFAULTS.ringStroke
  let colorName = DEFAULTS.colorName
  let colorAge = DEFAULTS.colorAge
  let colorLunar = DEFAULTS.colorLunar
  let colorQuote = DEFAULTS.colorQuote
  let cornerPhotoPath = DEFAULTS.cornerPhotoPath
  let cornerPhotoSize = DEFAULTS.cornerPhotoSize
  let cornerPhotoOffsetX = DEFAULTS.cornerPhotoOffsetX
  let cornerPhotoOffsetY = DEFAULTS.cornerPhotoOffsetY

  // 加载已保存设置
  const saved = loadSettings()
  nickname = saved.nickname
  birthday = saved.birthday
  nongli = saved.nongli
  eday = saved.eday
  bless = saved.bless
  avatarPath = saved.avatarPath
  ringSize = saved.ringSize
  fontName = saved.fontName
  fontAge = saved.fontAge
  fontLunar = saved.fontLunar
  fontQuote = saved.fontQuote
  fontMeetDays = saved.fontMeetDays
  padding = saved.padding
  ringStroke = saved.ringStroke
  colorName = saved.colorName
  colorAge = saved.colorAge
  colorLunar = saved.colorLunar
  colorQuote = saved.colorQuote
  cornerPhotoPath = saved.cornerPhotoPath
  cornerPhotoSize = saved.cornerPhotoSize
  cornerPhotoOffsetX = saved.cornerPhotoOffsetX
  cornerPhotoOffsetY = saved.cornerPhotoOffsetY

  let errorMsg = ''
  let savedMsg = ''

  function getCurrentSettings(): Settings {
    return {
      nickname: nickname || '小可爱',
      birthday,
      nongli,
      eday,
      bless,
      avatarPath,
      ringSize,
      fontName,
      fontAge,
      fontLunar,
      fontQuote,
      fontMeetDays,
      padding,
      ringStroke,
      colorName,
      colorAge,
      colorLunar,
      colorQuote,
      cornerPhotoPath,
      cornerPhotoSize,
      cornerPhotoOffsetX,
      cornerPhotoOffsetY,
    }
  }

  function handleSave() {
    if (!birthday || !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
      errorMsg = '请输入正确的生日日期格式：YYYY-MM-DD'
      return
    }
    if (eday && !/^\d{4}-\d{2}-\d{2}$/.test(eday)) {
      errorMsg = '请输入正确的相识日格式：YYYY-MM-DD'
      return
    }
    errorMsg = ''
    saveSettings(getCurrentSettings())
    savedMsg = '✅ 设置已保存'
  }

  async function handlePreview() {
    saveSettings(getCurrentSettings())
    savedMsg = ''
    await Script.run({
      name: '生日',
      queryParameters: { action: 'preview', family: 'systemMedium' },
    })
  }

  /** 加载图片 → 缩放到 maxSize 以内 → 压缩为 JPEG，写入目标路径 */
  async function compressAndSaveImage(sourcePath: string, destPath: string, maxSize: number, quality: number = 0.7): Promise<void> {
    try {
      const image = UIImage.fromFile(sourcePath)
      if (!image) {
        await FileManager.copyFile(sourcePath, destPath)
        return
      }
      const maxDim = Math.max(image.width, image.height)
      let thumb: UIImage | null = null
      if (maxDim > maxSize) {
        const scale = maxSize / maxDim
        thumb = image.preparingThumbnail({ width: Math.round(image.width * scale), height: Math.round(image.height * scale) })
      }
      const finalImage = thumb ?? image
      const data = finalImage.toJPEGData(quality)
      if (data) {
        await FileManager.writeAsData(destPath, data)
      } else {
        await FileManager.copyFile(sourcePath, destPath)
      }
    } catch (_) {
      await FileManager.copyFile(sourcePath, destPath)
    }
  }

  async function handlePickAvatar() {
    try {
      const results = await Photos.pick({ limit: 1 })
      if (results && results.length > 0) {
        const imagePath = await results[0].imagePath()
        if (imagePath) {
          const destDir = FileManager.appGroupDocumentsDirectory + '/birthday_avatar'
          if (!await FileManager.exists(destDir)) {
            await FileManager.createDirectory(destDir, true)
          }
          const destPath = destDir + '/avatar.jpg'
          if (await FileManager.exists(destPath)) {
            await FileManager.remove(destPath)
          }
          await compressAndSaveImage(imagePath, destPath, 300, 0.7)
          avatarPath = destPath
          saveSettings(getCurrentSettings())
          savedMsg = '✅ 头像已更新'
        }
      }
    } catch (e) {
      console.error('选择头像失败:', e)
    }
  }

  async function handlePickCornerPhoto() {
    try {
      const results = await Photos.pick({ limit: 1 })
      if (results && results.length > 0) {
        const imagePath = await results[0].imagePath()
        if (imagePath) {
          const destDir = FileManager.appGroupDocumentsDirectory + '/birthday_corner'
          if (!await FileManager.exists(destDir)) {
            await FileManager.createDirectory(destDir, true)
          }
          const destPath = destDir + '/corner_photo.jpg'
          if (await FileManager.exists(destPath)) {
            await FileManager.remove(destPath)
          }
          await compressAndSaveImage(imagePath, destPath, 240, 0.7)
          cornerPhotoPath = destPath
          saveSettings(getCurrentSettings())
          savedMsg = '✅ 装饰照片已更新'
        }
      }
    } catch (e) {
      console.error('选择装饰照片失败:', e)
    }
  }

  return (
    <NavigationStack>
      <List
        navigationTitle="破壳日 · 设置"
        toolbar={{
          cancellationAction: <Button title="关闭" action={dismiss} />,
        }}
      >
        {/* ═══════════════════════════════
            个人信息
            ═══════════════════════════════ */}
        <Section title="📝 个人信息">
          {/* 昵称 */}
          <HStack spacing={12}>
            <Text font={16}>👤 昵称</Text>
            <TextField
              title="昵称"
              value={nickname}
              onChanged={(v) => { nickname = v }}
              prompt="输入昵称"
            />
          </HStack>

          {/* 头像 */}
          <HStack spacing={12}>
            {avatarPath ? (
              <Image
                filePath={avatarPath}
                frame={{ width: 48, height: 48 }}
                clipShape="circle"
                resizable
              />
            ) : (
              <Image
                systemName="person.circle.fill"
                frame={{ width: 48, height: 48 }}
                foregroundStyle={'rgba(128,128,128,0.5)' as Color}
              />
            )}
            <Button title="📷 选择头像（左侧大图）" action={handlePickAvatar} />
            {avatarPath ? (
              <Button
                title="✕ 清除"
                action={() => {
                  avatarPath = ''
                  saveSettings(getCurrentSettings())
                  savedMsg = '✅ 头像已清除'
                }}
              />
            ) : null}
          </HStack>
          <Text font={12} foregroundStyle="rgba(128,128,128,0.6)">
            ※ 上传后作为小组件 Medium/Large 尺寸的左侧大图背景
          </Text>
        </Section>

        {/* ═══════════════════════════════
            日期信息
            ═══════════════════════════════ */}
        <Section title="📅 日期信息">
          {/* 生日 */}
          <HStack spacing={12}>
            <Text font={16}>🎂 生日</Text>
            <TextField
              title="生日"
              value={birthday}
              onChanged={(v) => { birthday = v }}
              prompt="YYYY-MM-DD"
            />
          </HStack>

          {/* 农历开关 */}
          <HStack spacing={12}>
            <Text font={16}>🌙 农历生日</Text>
            <Toggle
              value={nongli}
              onChanged={(v) => { nongli = v }}
            />
          </HStack>

          {/* 相识日 */}
          <HStack spacing={12}>
            <Text font={16}>💑 相识日</Text>
            <TextField
              title="相识日"
              value={eday}
              onChanged={(v) => { eday = v }}
              prompt="可选，格式 YYYY-MM-DD"
            />
          </HStack>
          <Text font={12} foregroundStyle="rgba(128,128,128,0.6)">
            ※ 设置后小组件昵称旁会显示相识天数
          </Text>

          {/* 寄语 */}
          <HStack spacing={12}>
            <Text font={16}>💌 寄语</Text>
            <TextField
              title="寄语"
              value={bless}
              onChanged={(v) => { bless = v }}
              prompt="可选，显示在左侧头像底部"
            />
          </HStack>
        </Section>

        {/* ═══════════════════════════════
            右上角装饰照片
            ═══════════════════════════════ */}
        <Section title="🖼️ 右上角装饰照片">
          <HStack spacing={12}>
            {cornerPhotoPath ? (
              <Image
                filePath={cornerPhotoPath}
                frame={{ width: 48, height: 48 }}
                clipShape={{ type: 'rect', cornerRadius: 6 }}
                resizable
              />
            ) : (
              <Image
                systemName="photo.badge.plus"
                frame={{ width: 48, height: 48 }}
                foregroundStyle={'rgba(128,128,128,0.5)' as Color}
              />
            )}
            <Button title="📷 上传装饰照片" action={handlePickCornerPhoto} />
            {cornerPhotoPath ? (
              <Button
                title="✕ 清除"
                action={() => {
                  cornerPhotoPath = ''
                  saveSettings(getCurrentSettings())
                  savedMsg = '✅ 装饰照片已清除'
                }}
              />
            ) : null}
          </HStack>
          <Text font={12} foregroundStyle="rgba(128,128,128,0.6)">
            ※ 照片自动裁剪为圆形，与圆环同水平位置
          </Text>

          {/* 照片大小 */}
          <HStack spacing={12}>
            <Text font={14}>📐 照片大小：{cornerPhotoSize}px</Text>
            <Spacer />
            <Slider
              value={cornerPhotoSize}
              min={20}
              max={120}
              step={2}
              onChanged={(v) => { cornerPhotoSize = v }}
              label={<Text>照片大小</Text>}
            />
          </HStack>



          {/* 横向间距 */}
          <HStack spacing={12}>
            <Text font={14}>↔️ 圆环间距：{cornerPhotoOffsetX}px</Text>
            <Spacer />
            <Slider
              value={cornerPhotoOffsetX}
              min={0}
              max={50}
              step={1}
              onChanged={(v) => { cornerPhotoOffsetX = v }}
              label={<Text>圆环间距</Text>}
            />
          </HStack>
          
          {/* 纵向微调 */}
          <HStack spacing={12}>
            <Text font={14}>↕️ 上下微调：{cornerPhotoOffsetY}px</Text>
            <Spacer />
            <Slider
              value={cornerPhotoOffsetY}
              min={-30}
              max={30}
              step={1}
              onChanged={(v) => { cornerPhotoOffsetY = v }}
              label={<Text>上下微调</Text>}
            />
          </HStack>
        </Section>

        {/* ═══════════════════════════════
            环形进度调节
            ═══════════════════════════════ */}
        <Section title="⭕ 环形进度调节">
          {/* 圆环大小 */}
          <HStack spacing={12}>
            <Text font={14}>⭕ 圆环大小：{ringSize}px</Text>
            <Spacer />
            <Slider
              value={ringSize}
              min={30}
              max={100}
              step={2}
              onChanged={(v) => { ringSize = v }}
              label={<Text>圆环大小</Text>}
            />
          </HStack>

          {/* 圆环粗细 */}
          <HStack spacing={12}>
            <Text font={14}>✏️ 圆环粗细：{ringStroke.toFixed(1)}px</Text>
            <Spacer />
            <Slider
              value={ringStroke}
              min={1}
              max={6}
              step={0.5}
              onChanged={(v) => { ringStroke = v }}
              label={<Text>圆环粗细</Text>}
            />
          </HStack>
        </Section>

        {/* ═══════════════════════════════
            字体大小调节
            ═══════════════════════════════ */}
        <Section title="🔤 字体大小调节">
          <HStack spacing={12}>
            <Text font={14}>👤 昵称字号：{fontName}</Text>
            <Spacer />
            <Slider
              value={fontName}
              min={10}
              max={30}
              step={1}
              onChanged={(v) => { fontName = v }}
              label={<Text>昵称字号</Text>}
            />
          </HStack>

          <HStack spacing={12}>
            <Text font={14}>⏳ 年龄字号：{fontAge}</Text>
            <Spacer />
            <Slider
              value={fontAge}
              min={8}
              max={20}
              step={1}
              onChanged={(v) => { fontAge = v }}
              label={<Text>年龄字号</Text>}
            />
          </HStack>

          <HStack spacing={12}>
            <Text font={14}>📅 农历/日期字号：{fontLunar}</Text>
            <Spacer />
            <Slider
              value={fontLunar}
              min={8}
              max={20}
              step={1}
              onChanged={(v) => { fontLunar = v }}
              label={<Text>农历字号</Text>}
            />
          </HStack>

          <HStack spacing={12}>
            <Text font={14}>💕 相识天数字号：{fontMeetDays}</Text>
            <Spacer />
            <Slider
              value={fontMeetDays}
              min={10}
              max={40}
              step={1}
              onChanged={(v) => { fontMeetDays = v }}
              label={<Text>相识天数字号</Text>}
            />
          </HStack>

          <HStack spacing={12}>
            <Text font={14}>💬 一言字号：{fontQuote}</Text>
            <Spacer />
            <Slider
              value={fontQuote}
              min={8}
              max={20}
              step={1}
              onChanged={(v) => { fontQuote = v }}
              label={<Text>一言字号</Text>}
            />
          </HStack>
        </Section>

        {/* ═══════════════════════════════
            颜色调节
            ═══════════════════════════════ */}
        <Section title="🎨 颜色调节（留空=自适应深/浅色）">
          <HStack spacing={12}>
            <Text font={14}>👤 昵称颜色</Text>
            <Spacer />
            <ColorPicker
              title="昵称颜色"
              value={(colorName || 'rgba(128,128,128,0.3)') as Color}
              onChanged={(v) => { colorName = v as string }}
              supportsOpacity={true}
            />
            {colorName ? (
              <Button title="重置" action={() => { colorName = '' }} />
            ) : null}
          </HStack>

          <HStack spacing={12}>
            <Text font={14}>⏳ 年龄颜色</Text>
            <Spacer />
            <ColorPicker
              title="年龄颜色"
              value={(colorAge || 'rgba(128,128,128,0.3)') as Color}
              onChanged={(v) => { colorAge = v as string }}
              supportsOpacity={true}
            />
            {colorAge ? (
              <Button title="重置" action={() => { colorAge = '' }} />
            ) : null}
          </HStack>

          <HStack spacing={12}>
            <Text font={14}>📅 农历/日期颜色</Text>
            <Spacer />
            <ColorPicker
              title="农历颜色"
              value={(colorLunar || 'rgba(128,128,128,0.3)') as Color}
              onChanged={(v) => { colorLunar = v as string }}
              supportsOpacity={true}
            />
            {colorLunar ? (
              <Button title="重置" action={() => { colorLunar = '' }} />
            ) : null}
          </HStack>

          <HStack spacing={12}>
            <Text font={14}>💬 一言颜色</Text>
            <Spacer />
            <ColorPicker
              title="一言颜色"
              value={(colorQuote || 'rgba(128,128,128,0.3)') as Color}
              onChanged={(v) => { colorQuote = v as string }}
              supportsOpacity={true}
            />
            {colorQuote ? (
              <Button title="重置" action={() => { colorQuote = '' }} />
            ) : null}
          </HStack>

          <Text font={12} foregroundStyle="rgba(128,128,128,0.6)">
            ※ 留空 = 自动适应系统深/浅色模式；选色后可点「重置」恢复默认
          </Text>
        </Section>

        {/* ═══════════════════════════════
            内边距
            ═══════════════════════════════ */}
        <Section title="📏 内边距">
          <HStack spacing={12}>
            <Text font={14}>⬜ 小组件内边距：{padding}px</Text>
            <Spacer />
            <Slider
              value={padding}
              min={4}
              max={30}
              step={1}
              onChanged={(v) => { padding = v }}
              label={<Text>内边距</Text>}
            />
          </HStack>
        </Section>

        {/* ═══════════════════════════════
            操作按钮
            ═══════════════════════════════ */}
        <Section title="💾 保存">
          <HStack spacing={12}>
            <Button title="💾 保存设置" action={handleSave} />
            <Button title="👁 预览组件" action={handlePreview} />
          </HStack>
          {errorMsg ? (
            <Text font={14} foregroundStyle="red">{errorMsg}</Text>
          ) : null}
          {savedMsg ? (
            <Text font={14} foregroundStyle="green">{savedMsg}</Text>
          ) : null}
        </Section>
      </List>
    </NavigationStack>
  )
}

async function run() {
  await Navigation.present(<SettingsPage />)
  Script.exit()
}

run()
