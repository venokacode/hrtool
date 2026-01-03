#!/bin/bash

# 英语写作测评系统 - Vercel部署脚本
# 使用方法: ./deploy.sh

echo "🚀 开始部署到Vercel..."
echo ""

# 检查是否安装了Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI未安装"
    echo "📦 正在安装Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI安装完成"
    echo ""
fi

# 检查项目是否可以构建
echo "🔍 检查项目构建..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 项目构建失败，请先修复错误"
    exit 1
fi

echo "✅ 项目构建成功"
echo ""

# 询问部署环境
echo "请选择部署环境:"
echo "1) Production (生产环境)"
echo "2) Preview (预览环境)"
read -p "请输入选项 (1 或 2): " env_choice

case $env_choice in
    1)
        echo "📦 部署到生产环境..."
        vercel --prod
        ;;
    2)
        echo "📦 部署到预览环境..."
        vercel
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 部署成功！"
    echo "🎉 您的应用已上线"
else
    echo ""
    echo "❌ 部署失败"
    exit 1
fi
