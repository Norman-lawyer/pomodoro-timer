import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // 设置为相对路径
  build: {
    assetsDir: '', // 将资源文件直接输出到dist根目录
    rollupOptions: {
      output: {
        assetFileNames: `[name].[hash].[ext]`, // 保持hash但移除子目录
        entryFileNames: `[name].[hash].js`
      }
    }
  }
})