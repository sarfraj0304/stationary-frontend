export const getDesignTheme = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // palette values for light mode
          primary: {
            light: "#a36ef4",
            main: "#8C4AF2",
            dark: "#6233a9",
          },
          secondary: {
            light: "#f5f6fa",
            main: "#e5eaff",
            dark: "#ddc7ff",
          },
          contras: {
            main: "#000000",
          },
          current: {
            main: "#ffffff",
          },
          disable: {
            light: "#888888",
            main: "#8888884d",
            dark: "#636678",
            contrastText: "#fff",
          },
          background: {
            default: "#ffffff",
            dark: "#2a3042",
            navBar: "#ffffff",
            sideBar: "#EFEFEF",
            sideBar2: "#DfDfDf",
            card: "#d2affd",
            card2: "#eff2f7",
            card3: "#f8fafb",
          },
          icon: {
            green: "#68B34E",
            dark: "#069e10",
            warning: "#FFA800",
            error: "#f46a6a",
            sidebar: "#EFEFEF",
            sidebar1: "#ffffff",
            fieldErr: "#F83630",
            blue: "#6b56f6",
          },
          text: {
            head: "#323139",
            normal: "#4d4d4d",
            primary: "#212121",
            secondary: "#878787",
            contrasPrimary: "#ffffff",
            contrasSecondary: "#ffffff88",
            sidebar: "#7c7c7c",
            dashboard: "#545454",
          },
          border: {
            main: "#eff2f7",
            primary: "#495057",
            scroll: " #666e7c",
            input: "#7443C4",
          },
          shadow: {
            navBar: "#12263f08",
          },
          color: {
            pink: {
              primary: "#FBE6F1",
              secondary: "#f5c2dc",
            },
            orange: { primary: "#fef2e2", secondary: "#ffd399" },
            green: { primary: "#CDFFCE", secondary: "#94ff96" },
            yellow: { primary: "#fffce5", secondary: "#fff394" },
            purple: { primary: "#f0e2fe", secondary: "#cc99ff" },
            red: { primary: "#ffe5e5", secondary: "#ff9999" },
            blue: { primary: "#e2e9fe", secondary: "#adc2ff" },
            clayBlue: { primary: "#e3f3fc", secondary: "#94d8ff" },
            voilet: { primary: "#e2dffb", secondary: "#9f94ff" },
            grey: "#DFE4FF",
          },
          attendance: {
            light: "#93a5ff",
            present: "#3CCF4E",
            leave: "#EF5B0C",
            absent: "#C21010",
            sports: "#277BC0",
            medical: "#1CD6CE",
            "first half": "#F6A192",
            half: "#F6A192",
            "second half": "#EA6823",
            chip: "#00000014",
          },
          button: { main: "#9080f8", light: "#efedfe" },
        }
      : {
          // palette values for dark mode
          primary: {
            main: "#EA6823",
          },
          secondary: {
            main: "#000",
          },
          background: {
            default: "#222736",
          },
        }),
  },
  typography: {
    fontFamily: ["Poppins", "sans-serif"].join(","),
  },
  selected: {},
});
