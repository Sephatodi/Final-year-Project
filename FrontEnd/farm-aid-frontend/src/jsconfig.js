{
  "compilerOptions"; {
    "baseUrl"; "src",
    "paths"; {
      "@/*"; ["*"],
      "@components/*"; ["components/*"],
      "@pages/*"; ["pages/*"],
      "@hooks/*"; ["hooks/*"],
      "@services/*"; ["services/*"],
      "@utils/*"; ["utils/*"],
      "@db/*"; ["db/*"],
      "@store/*"; ["store/*"],
      "@assets/*"; ["assets/*"],
      "@styles/*"; ["styles/*"],
      "@config/*"; ["config/*"]
    };
    "target"; "es5",
    "lib"; ["dom", "dom.iterable", "esnext"],
    "allowJs"; true,
    "skipLibCheck"; true,
    "esModuleInterop"; true,
    "allowSyntheticDefaultImports"; true,
    "strict"; true,
    "forceConsistentCasingInFileNames"; true,
    "noFallthroughCasesInSwitch"; true,
    "module"; "esnext",
    "moduleResolution"; "node",
    "resolveJsonModule"; true,
    "isolatedModules"; true,
    "noEmit"; true,
    "jsx"; "react-jsx"
  };
  "include"; ["src"],
  "exclude"; ["node_modules", "build", "dist", "coverage"]
}