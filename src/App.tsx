import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  HelpCircle,
  Target,
  Trophy,
  Activity,
  BarChart,
  Download,
  Eye,
  Edit3,
  Layout,
  Key,
  PlayCircle,
  Image as ImageIcon,
  GitFork,
  Layers,
  ArrowRight,
  Info,
  FileCode,
  Printer,
  FileText,
  Type,
  Palette,
  Monitor,
  AlignLeft,
  AlignRight,
  AlignCenter,
  ArrowUp,
  ArrowDown,
  Lightbulb,
  CheckCircle,
  X,
  Upload,
  Save,
  FolderOpen,
  Plus,
  Trash2,
  History,
} from "lucide-react";

const MicrolearningStudio = () => {
  // --- ESTADOS GLOBALES ---
  const [viewMode, setViewMode] = useState("edit");
  const [showIntro, setShowIntro] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);

  // --- DATOS DEL PROYECTO ACTUAL ---
  const [projectName, setProjectName] = useState("Nuevo Proyecto");
  const [projectId, setProjectId] = useState(null); // ID único para actualizaciones
  const [lastSaved, setLastSaved] = useState(null);

  const [activeStrategy, setActiveStrategy] = useState("casos");
  const [activeStructure, setActiveStructure] = useState("basic");
  const [activePath, setActivePath] = useState("main");

  // --- ESTADOS DE DISEÑO ---
  const [globalStyles, setGlobalStyles] = useState({
    fontFamily: "sans",
    primaryColor: "#0284c7",
    fontSize: "medium",
  });

  // --- DATA STORE (Contenido) ---
  const [contentMap, setContentMap] = useState({});

  // --- BIBLIOTECA (Historial Local) ---
  const [projectLibrary, setProjectLibrary] = useState(() => {
    try {
      const saved = localStorage.getItem("mls_library");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Guardar biblioteca en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("mls_library", JSON.stringify(projectLibrary));
  }, [projectLibrary]);

  // Referencia para carga de archivo JSON externo
  const fileInputRef = useRef(null);

  // --- BASE PEDAGÓGICA ---
  const pedagogyTips = {
    casos: {
      1: {
        tip: "Contexto: Describe el escenario y protagonistas sin revelar la solución.",
        ex: "El gerente nota una caída en ventas...",
      },
      2: {
        tip: "Evidencia: Presenta datos o pistas clave para analizar.",
        ex: "Gráfico de tendencias del último mes.",
      },
      3: {
        tip: "Dilema: Fuerza una decisión difícil con pros y contras.",
        ex: "¿Invertir en marketing o reducir costos?",
      },
      4: {
        tip: "Cierre: Compara la decisión del alumno con la experta.",
        ex: "La mejor opción era invertir porque...",
      },
    },
  };

  // --- CONFIGURACIÓN ---
  const strategies = {
    casos: { name: "Casos", icon: <BookOpen className="w-4 h-4" /> },
    problemas: { name: "ABP", icon: <HelpCircle className="w-4 h-4" /> },
    proyectos: { name: "Proyectos", icon: <Target className="w-4 h-4" /> },
    retos: { name: "Retos", icon: <Trophy className="w-4 h-4" /> },
    simulacion: { name: "Simulación", icon: <Activity className="w-4 h-4" /> },
    datos: { name: "Datos", icon: <BarChart className="w-4 h-4" /> },
  };

  const structures = {
    basic: {
      id: "basic",
      label: "Secuencial (4 Pasos)",
      desc: "Lineal y directo.",
      icon: <Layout className="w-5 h-5" />,
      paths: ["main"],
      levels: {
        main: [
          { id: 1, label: "Contexto" },
          { id: 2, label: "Desarrollo" },
          { id: 3, label: "Aplicación" },
          { id: 4, label: "Cierre" },
        ],
      },
    },
    branching: {
      id: "branching",
      label: "Ramificado (A/B)",
      desc: "Decisiones alteran el rumbo.",
      icon: <GitFork className="w-5 h-5" />,
      paths: ["main", "pathA", "pathB"],
      levels: {
        main: [
          { id: 1, label: "Intro" },
          { id: 2, label: "Decisión Clave" },
        ],
        pathA: [
          { id: "A1", label: "Consecuencia A" },
          { id: "A2", label: "Resolución A" },
          { id: "A3", label: "Final A" },
        ],
        pathB: [
          { id: "B1", label: "Consecuencia B" },
          { id: "B2", label: "Resolución B" },
          { id: "B3", label: "Final B" },
        ],
      },
    },
  };

  // --- HANDLERS CONTENIDO ---
  const handleContentChange = (path, levelId, field, value) => {
    const key = `${activeStrategy}_${activeStructure}_${path}_${levelId}`;
    setContentMap((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const getContent = (path, levelId) => {
    const key = `${activeStrategy}_${activeStructure}_${path}_${levelId}`;
    return (
      contentMap[key] || {
        input: "",
        output: "",
        mediaUrl: "",
        mediaType: "image",
        layout: "top",
      }
    );
  };

  const getPedagogy = (lvlId) => {
    const stratTips = pedagogyTips[activeStrategy] || pedagogyTips["casos"];
    return (
      stratTips[lvlId] || {
        tip: "Define el contenido clave para esta etapa.",
        ex: "Ejemplo genérico...",
      }
    );
  };

  const renderMedia = (url, type, editMode = false) => {
    if (!url)
      return (
        <div
          className={`bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 p-4 ${
            editMode ? "h-32" : "h-full min-h-[200px]"
          }`}
        >
          <ImageIcon className="w-8 h-8 mb-2" />
          <span className="text-xs">Sin multimedia</span>
        </div>
      );
    if (type === "video") {
      let embedUrl = url;
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = url.split("v=")[1] || url.split("/").pop();
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
      return (
        <iframe
          src={embedUrl}
          className="w-full h-full min-h-[200px] rounded-xl aspect-video"
          title="Video"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      );
    }
    return (
      <img
        src={url}
        alt="Media"
        className="w-full h-auto rounded-xl object-cover shadow-sm"
      />
    );
  };

  // --- GESTIÓN DE PROYECTOS (NUEVO) ---

  const saveToLibrary = () => {
    const newProject = {
      id: projectId || Date.now().toString(),
      name: projectName,
      date: new Date().toLocaleString(),
      strategy: activeStrategy,
      structure: activeStructure,
      styles: globalStyles,
      content: contentMap,
    };

    // Actualizar si existe, o agregar si es nuevo
    const existingIndex = projectLibrary.findIndex(
      (p) => p.id === newProject.id
    );
    let newLibrary = [...projectLibrary];

    if (existingIndex >= 0) {
      newLibrary[existingIndex] = newProject;
    } else {
      newLibrary.push(newProject);
    }

    setProjectLibrary(newLibrary);
    setProjectId(newProject.id); // Asegurar que tenemos ID
    setLastSaved(new Date().toLocaleTimeString());
    alert(`Proyecto "${projectName}" guardado en el historial local.`);
  };

  const loadFromLibrary = (project) => {
    if (
      confirm(
        `¿Cargar "${project.name}"? Se perderán los cambios no guardados del proyecto actual.`
      )
    ) {
      setProjectName(project.name);
      setProjectId(project.id);
      setActiveStrategy(project.strategy);
      setActiveStructure(project.structure);
      setGlobalStyles(project.styles);
      setContentMap(project.content);
      setShowLibraryModal(false);
    }
  };

  const deleteFromLibrary = (id) => {
    if (confirm("¿Seguro que quieres eliminar este proyecto del historial?")) {
      setProjectLibrary((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const createNewProject = () => {
    if (confirm("¿Crear nuevo proyecto? Se limpiará el área de trabajo.")) {
      setProjectName("Nuevo Proyecto");
      setProjectId(null);
      setLastSaved(null);
      setContentMap({});
      setActivePath("main");
      setShowLibraryModal(false);
    }
  };

  // Cargar archivo JSON externo
  const handleImportJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.content) {
          setProjectName(data.meta?.name || "Proyecto Importado");
          setProjectId(null); // Importado = Nuevo ID al guardar
          if (data.meta?.strategyKey) setActiveStrategy(data.meta.strategyKey);
          if (data.meta?.structureKey)
            setActiveStructure(data.meta.structureKey);
          if (data.styles) setGlobalStyles(data.styles);
          setContentMap(data.content);
          alert("Proyecto importado correctamente.");
        }
      } catch (error) {
        alert("Error al leer el archivo.");
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };

  // --- EXPORTACIÓN ---

  const getSafeFilename = (ext) => {
    return projectName.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ext;
  };

  const downloadHTML = () => {
    const struct = structures[activeStructure];
    const strat = strategies[activeStrategy];
    const fontMap = {
      sans: "Helvetica, Arial, sans-serif",
      serif: "Georgia, serif",
      mono: "Courier New, monospace",
    };
    const sizeMap = { small: "14px", medium: "16px", large: "18px" };

    let htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${projectName}</title>
      <style>
        body { font-family: ${fontMap[globalStyles.fontFamily]}; font-size: ${
      sizeMap[globalStyles.fontSize]
    }; line-height: 1.6; color: #333; max-width: 900px; margin: 0 auto; padding: 20px; background-color: #f8fafc; }
        .header { background-color: white; padding: 30px; border-radius: 12px; border-bottom: 5px solid ${
          globalStyles.primaryColor
        }; margin-bottom: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header h1 { color: ${globalStyles.primaryColor}; margin: 0; }
        .path-section { margin-bottom: 50px; }
        .path-title { font-size: 1.2em; font-weight: bold; color: #64748b; margin-bottom: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; text-transform: uppercase; }
        .card { background: white; border-radius: 16px; overflow: hidden; margin-bottom: 40px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
        .card-header { background-color: ${
          globalStyles.primaryColor
        }15; padding: 15px 25px; border-bottom: 1px solid ${
      globalStyles.primaryColor
    }30; display: flex; justify-content: space-between; align-items: center; }
        .card-title { font-weight: bold; color: ${
          globalStyles.primaryColor
        }; margin: 0; }
        .card-body { padding: 30px; display: flex; gap: 30px; flex-direction: column; }
        .layout-left { flex-direction: row; } .layout-right { flex-direction: row-reverse; } .layout-top { flex-direction: column; } .layout-bottom { flex-direction: column-reverse; }
        .media-container { flex: 1; min-width: 300px; } .media-container img, .media-container iframe { width: 100%; border-radius: 8px; }
        .text-container { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .activity-box { background-color: #f8fafc; border-left: 4px solid ${
          globalStyles.primaryColor
        }; padding: 20px; margin-top: 20px; border-radius: 0 8px 8px 0; }
        .activity-title { font-weight: bold; font-size: 0.9em; text-transform: uppercase; color: #94a3b8; margin-bottom: 10px; }
        @media (max-width: 768px) { .layout-left, .layout-right { flex-direction: column; } }
      </style>
    </head>
    <body>
      <div class="header"><h1>${projectName}</h1><p>${strat.name} - ${
      struct.label
    }</p></div>
    `;

    // @ts-ignore
    struct.paths.forEach((pathKey) => {
      htmlContent += `<div class="path-section"><div class="path-title">${
        pathKey === "main" ? "Secuencia Principal" : pathKey
      }</div>`;
      // @ts-ignore
      struct.levels[pathKey].forEach((lvl) => {
        const data = getContent(pathKey, lvl.id);
        let mediaHtml = "";
        if (data.mediaUrl) {
          if (data.mediaType === "video") {
            let embed = data.mediaUrl;
            if (data.mediaUrl.includes("youtube"))
              embed = `https://www.youtube.com/embed/${
                data.mediaUrl.split("v=")[1]
              }`;
            mediaHtml = `<div class="media-container"><iframe src="${embed}" height="300" style="width:100%" frameborder="0" allowfullscreen></iframe></div>`;
          } else {
            mediaHtml = `<div class="media-container"><img src="${data.mediaUrl}" alt="Media"></div>`;
          }
        }
        htmlContent += `<div class="card"><div class="card-header"><h3 class="card-title">${
          lvl.label
        }</h3></div><div class="card-body layout-${
          data.layout
        }">${mediaHtml}<div class="text-container"><div>${
          data.input || ""
        }</div>${
          data.output
            ? `<div class="activity-box"><div class="activity-title">Actividad</div>${data.output}</div>`
            : ""
        }</div></div></div>`;
      });
      htmlContent += `</div>`;
    });
    htmlContent += `</body></html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = getSafeFilename(".html");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadProjectFile = () => {
    const struct = structures[activeStructure];
    const exportData = {
      meta: {
        name: projectName,
        strategyKey: activeStrategy,
        structureKey: activeStructure,
        created: new Date().toISOString(),
      },
      styles: globalStyles,
      content: contentMap,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = getSafeFilename(".json");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-600 pb-20 print:bg-white">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg text-white shadow">
            <Palette className="w-5 h-5" />
          </div>
          <div className="hidden md:block">
            <h1 className="font-bold text-slate-800">
              Microlearning <span className="text-indigo-600">Studio</span>
            </h1>
            <p className="text-[10px] font-bold tracking-wider text-slate-400">
              v9.0 Project Manager
            </p>
          </div>
        </div>

        {/* Project Name Input */}
        <div className="flex-1 max-w-md mx-auto w-full">
          <div className="relative group">
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-lg py-1.5 px-3 text-center font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              placeholder="Nombre del Proyecto..."
            />
            <div className="absolute right-3 top-2 text-[10px] text-slate-400 pointer-events-none">
              {lastSaved ? "Guardado" : "Sin guardar"}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setShowLibraryModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors"
            title="Historial de Proyectos"
          >
            <History className="w-4 h-4" />{" "}
            <span className="hidden sm:inline">Historial</span>
          </button>
          <button
            onClick={saveToLibrary}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
            title="Guardar cambios"
          >
            <Save className="w-4 h-4" />{" "}
            <span className="hidden sm:inline">Guardar</span>
          </button>
          <button
            onClick={() =>
              setViewMode(viewMode === "edit" ? "preview" : "edit")
            }
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
        {/* SIDEBAR */}
        <div
          className={`lg:col-span-3 space-y-8 ${
            viewMode === "preview" ? "hidden" : ""
          } print:hidden`}
        >
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <BookOpen className="w-3 h-3" /> 1. Estrategia
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(strategies).map(([key, strat]) => (
                <button
                  key={key}
                  onClick={() => setActiveStrategy(key)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    activeStrategy === key
                      ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {strat.icon}
                  <span className="text-[10px] font-bold mt-1">
                    {strat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Palette className="w-3 h-3" /> 2. Diseño Visual
            </label>
            <div>
              <span className="text-xs font-semibold mb-2 block text-slate-600">
                Color Principal
              </span>
              <div className="flex gap-2">
                {[
                  "#0284c7",
                  "#7c3aed",
                  "#059669",
                  "#ea580c",
                  "#e11d48",
                  "#000000",
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() =>
                      setGlobalStyles({ ...globalStyles, primaryColor: c })
                    }
                    className={`w-6 h-6 rounded-full border-2 ${
                      globalStyles.primaryColor === c
                        ? "border-slate-400 scale-110"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  ></button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold mb-2 block text-slate-600">
                Tipografía
              </span>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                {["sans", "serif", "mono"].map((f) => (
                  <button
                    key={f}
                    onClick={() =>
                      setGlobalStyles({ ...globalStyles, fontFamily: f })
                    }
                    className={`flex-1 py-1 text-[10px] rounded font-bold uppercase ${
                      globalStyles.fontFamily === f
                        ? "bg-white shadow text-indigo-600"
                        : "text-slate-400"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CANVAS */}
        <div
          className={`${
            viewMode === "preview"
              ? "lg:col-span-12 max-w-4xl mx-auto"
              : "lg:col-span-9"
          } space-y-8 print:w-full`}
        >
          {/* INTRO */}
          {showIntro && viewMode === "edit" && (
            <div className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm relative overflow-hidden flex gap-4 items-start print:hidden">
              <button
                onClick={() => setShowIntro(false)}
                className="absolute top-4 right-4 text-slate-300 hover:text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="bg-indigo-50 p-3 rounded-full text-indigo-600">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-slate-800">
                  Bienvenido, Docente
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Ponle un nombre a tu proyecto arriba.{" "}
                  <strong>Recuerda presionar "Guardar"</strong> para mantenerlo
                  en el historial de este navegador.
                </p>
              </div>
            </div>
          )}

          {/* PATH NAVIGATOR */}
          {activeStructure === "branching" && viewMode === "edit" && (
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 print:hidden">
              {/* @ts-ignore */}
              {structures.branching.paths.map((path) => (
                <button
                  key={path}
                  onClick={() => setActivePath(path)}
                  className={`px-4 py-2 rounded-t-lg text-sm font-bold border-t border-x ${
                    activePath === path
                      ? "bg-white border-slate-200 text-indigo-600"
                      : "bg-slate-50 text-slate-400"
                  }`}
                >
                  {path}
                </button>
              ))}
            </div>
          )}

          {/* CARDS */}
          <div className="space-y-10">
            {/* @ts-ignore */}
            {(activeStructure === "branching" && viewMode === "edit"
              ? [activePath]
              : structures[activeStructure].paths
            ).map((pathKey) => (
              <div
                key={pathKey}
                className={
                  activeStructure === "branching" &&
                  pathKey !== activePath &&
                  viewMode === "edit"
                    ? "hidden"
                    : "block"
                }
              >
                {/* @ts-ignore */}
                {structures[activeStructure].levels[pathKey].map((level) => {
                  const data = getContent(pathKey, level.id);
                  const tips = getPedagogy(level.id);
                  const layoutClasses = {
                    top: "flex-col",
                    bottom: "flex-col-reverse",
                    left: "md:flex-row",
                    right: "md:flex-row-reverse",
                  };

                  if (viewMode === "preview") {
                    // PREVIEW MODE
                    return (
                      <div
                        key={level.id}
                        className="bg-white rounded-[2rem] border-8 border-slate-100 shadow-2xl overflow-hidden mb-8 print:break-inside-avoid print:shadow-none print:border-2"
                        style={{
                          fontFamily: globalStyles.fontFamily,
                          fontSize: globalStyles.fontSize,
                        }}
                      >
                        <div
                          className="p-6 border-b print:bg-white"
                          style={{
                            backgroundColor: `${globalStyles.primaryColor}10`,
                          }}
                        >
                          <span
                            className="text-[10px] font-black uppercase tracking-widest bg-white px-2 py-1 rounded-full border shadow-sm"
                            style={{ color: globalStyles.primaryColor }}
                          >
                            Nivel {level.id}
                          </span>
                          <h3
                            className="text-xl font-bold mt-2"
                            style={{ color: globalStyles.primaryColor }}
                          >
                            {level.label}
                          </h3>
                        </div>
                        <div
                          className={`p-6 flex gap-6 ${
                            layoutClasses[data.layout]
                          }`}
                        >
                          <div
                            className={`flex-1 ${
                              ["top", "bottom"].includes(data.layout)
                                ? "w-full"
                                : "w-1/2"
                            }`}
                          >
                            {renderMedia(data.mediaUrl, data.mediaType)}
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="whitespace-pre-wrap">
                              {data.input || "..."}
                            </div>
                            {data.output && (
                              <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
                                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">
                                  Actividad
                                </h4>
                                <div className="font-medium">{data.output}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // EDITOR MODE
                  return (
                    <div
                      key={level.id}
                      className="group bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all overflow-hidden print:hidden"
                    >
                      <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-sm"
                            style={{
                              backgroundColor: globalStyles.primaryColor,
                            }}
                          >
                            {level.id}
                          </div>
                          <h3 className="font-bold text-slate-700 text-sm">
                            {level.label}
                          </h3>
                        </div>
                        <div className="flex bg-white border border-slate-200 rounded-lg p-1 gap-1">
                          {[
                            {
                              id: "top",
                              icon: <ArrowUp className="w-3 h-3" />,
                            },
                            {
                              id: "bottom",
                              icon: <ArrowDown className="w-3 h-3" />,
                            },
                            {
                              id: "left",
                              icon: <AlignLeft className="w-3 h-3" />,
                            },
                            {
                              id: "right",
                              icon: <AlignRight className="w-3 h-3" />,
                            },
                          ].map((l) => (
                            <button
                              key={l.id}
                              onClick={() =>
                                handleContentChange(
                                  pathKey,
                                  level.id,
                                  "layout",
                                  l.id
                                )
                              }
                              className={`p-1.5 rounded ${
                                data.layout === l.id
                                  ? "bg-slate-800 text-white"
                                  : "hover:bg-slate-100 text-slate-400"
                              }`}
                            >
                              {l.icon}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="bg-blue-50 px-6 py-3 flex gap-3 items-start border-b border-blue-100">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-blue-800">
                          <span className="font-bold block mb-1">
                            Tip Pedagógico:
                          </span>
                          {tips.tip}{" "}
                          <span className="italic text-blue-600">
                            Ej: {tips.ex}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                              Contenido (Texto)
                            </label>
                            <textarea
                              className="w-full h-24 p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                              placeholder="Escribe aquí..."
                              value={data.input}
                              onChange={(e) =>
                                handleContentChange(
                                  pathKey,
                                  level.id,
                                  "input",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">
                              Multimedia
                            </label>
                            <div className="flex gap-2 mb-2">
                              <button
                                onClick={() =>
                                  handleContentChange(
                                    pathKey,
                                    level.id,
                                    "mediaType",
                                    "image"
                                  )
                                }
                                className={`flex-1 text-xs py-1 rounded border ${
                                  data.mediaType === "image"
                                    ? "bg-white border-indigo-500 text-indigo-600 font-bold"
                                    : "border-transparent text-slate-500"
                                }`}
                              >
                                Imagen
                              </button>
                              <button
                                onClick={() =>
                                  handleContentChange(
                                    pathKey,
                                    level.id,
                                    "mediaType",
                                    "video"
                                  )
                                }
                                className={`flex-1 text-xs py-1 rounded border ${
                                  data.mediaType === "video"
                                    ? "bg-white border-indigo-500 text-indigo-600 font-bold"
                                    : "border-transparent text-slate-500"
                                }`}
                              >
                                Video
                              </button>
                            </div>
                            <input
                              type="text"
                              className="w-full text-xs p-2 border rounded bg-white"
                              placeholder={
                                data.mediaType === "video"
                                  ? "https://youtube.com/..."
                                  : "https://sitio.com/img.jpg"
                              }
                              value={data.mediaUrl}
                              onChange={(e) =>
                                handleContentChange(
                                  pathKey,
                                  level.id,
                                  "mediaUrl",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
                              <Target className="w-3 h-3" /> Actividad
                            </label>
                            <textarea
                              className="w-full h-24 p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                              placeholder="¿Qué debe hacer el alumno?"
                              value={data.output}
                              onChange={(e) =>
                                handleContentChange(
                                  pathKey,
                                  level.id,
                                  "output",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LIBRARY MODAL (HISTORIAL) */}
      {showLibraryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Biblioteca de Proyectos
                </h2>
                <p className="text-sm text-slate-500">
                  Historial local de este dispositivo
                </p>
              </div>
              <button onClick={() => setShowLibraryModal(false)}>
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {projectLibrary.length === 0 && (
                <div className="text-center text-slate-400 py-10">
                  No hay proyectos guardados aún.
                </div>
              )}
              {projectLibrary.map((proj) => (
                <div
                  key={proj.id}
                  className="flex items-center justify-between p-4 border rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                >
                  <div
                    onClick={() => loadFromLibrary(proj)}
                    className="flex-1 cursor-pointer"
                  >
                    <h4 className="font-bold text-slate-700">{proj.name}</h4>
                    <span className="text-xs text-slate-400">
                      {proj.date} • {strategies[proj.strategy]?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteFromLibrary(proj.id)}
                    className="p-2 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t mt-4 flex gap-3 justify-between items-center">
              <div className="text-xs text-slate-400">
                También puedes importar un archivo .json
              </div>
              <div className="flex gap-2">
                <button
                  onClick={createNewProject}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200"
                >
                  <Plus className="w-4 h-4" /> Nuevo
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 cursor-pointer">
                  <Upload className="w-4 h-4" /> Importar JSON
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportJSON}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Exportar / Guardar
              </h2>
              <button onClick={() => setShowExportModal(false)}>
                <X />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={downloadHTML}
                className="p-6 border-2 border-slate-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center gap-3 group"
              >
                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  <FileCode className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-center">
                  <span className="block font-bold text-slate-700 text-sm">
                    Sitio Web (HTML)
                  </span>
                  <span className="text-[10px] text-slate-500">Para LMS</span>
                </div>
              </button>
              <button
                onClick={() => window.print()}
                className="p-6 border-2 border-slate-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all flex flex-col items-center gap-3 group"
              >
                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  <Printer className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-center">
                  <span className="block font-bold text-slate-700 text-sm">
                    Imprimir / PDF
                  </span>
                  <span className="text-[10px] text-slate-500">Físico</span>
                </div>
              </button>
              <button
                onClick={downloadProjectFile}
                className="p-6 border-2 border-slate-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center gap-3 group"
              >
                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  <Save className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-center">
                  <span className="block font-bold text-slate-700 text-sm">
                    Archivo Proyecto
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Guardar respaldo .json
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MicrolearningStudio;
