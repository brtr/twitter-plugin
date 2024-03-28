version := `node -p "require('./package.json').version"`
release_folder := "x-token-price@v" + version

build:
  pnpm run build

release: build
  mkdir -p {{release_folder}}
  cp -R build/ {{release_folder}}/
  zip -r "{{release_folder}}.zip" "{{release_folder}}/"
  rm -r "{{release_folder}}/"
  echo "Release created: {{release_folder}}.zip"
