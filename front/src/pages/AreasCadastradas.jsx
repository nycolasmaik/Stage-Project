import { useEffect, useState } from "react";
import axios from "axios";
import Grid from "../components/Grid";
import Modal from "../components/Modal";
import ArvoreProcessos from "../components/ArvoreProcessos";
import { useNavigate } from "react-router-dom";

const serviceBase = "https://localhost:7064";

export default function ListagemAreas() {
  const [areas, setAreas] = useState([]);
  const navigate = useNavigate();

  const [ModalCriar, setModalCriarOpen] = useState(false);
  const [ModalEditar, setModalEditarOpen] = useState(false);
  const [ModalDeletar, setModalDeletarOpen] = useState(false);
  const [ModalArvore, setModalArvoreOpen] = useState(false);
  //const [ModalCriarProcesso, setModalCriarProcessoOpen] = useState(false);

  const [nomeAreaCriacao, setNomeAreaCriacao] = useState("");
  const [areaParaEditar, setAreaParaEditar] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [areaParaDeletar, setAreaParaDeletar] = useState("");
  const [processosDaArea, setProcessosDaArea] = useState([]);

  const [ModalProcesso, setModalProcessoOpen] = useState(false);
  const [modoEdicaoProcesso, setModoEdicaoProcesso] = useState(false);
  const [formProcesso, setFormProcesso] = useState({
    id: null,
    idArea: null,
    idPai: null,
    nome: "",
    descricao: "",
    ferramentas: "",
    responsaveis: "",
    documentacoes: "",
    isSistemico: false,
    status: "Ativo"
  });

  const AbrirModalCriarProcesso = (idArea, idPai = null) => {    
    setModoEdicaoProcesso(false);
    setFormProcesso({
      id: null,
      idArea: idArea,
      idPai: idPai, 
      nome: "",
      descricao: "",
      ferramentas: "",
      responsaveis: "",
      documentacoes: "",
      isSistemico: false,
      status: "Ativo"
    });
    setModalProcessoOpen(true);
  };

  const AbrirModalEditarProcesso = (processo) => {
    setModoEdicaoProcesso(true);
    setFormProcesso({ ...processo }); // Carrega os dados do processo clicado
    setModalProcessoOpen(true);
  };

  const SalvarProcesso = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicaoProcesso) {
        await axios.put(`${serviceBase}/api/UpdateProcess?id=${formProcesso.id}`, formProcesso);
      } else {
        await axios.post(`${serviceBase}/api/CreateProcess`, formProcesso);
      }
      setModalProcessoOpen(false);
      VerProcessos(formProcesso.idArea); // Recarrega a árvore para ver as mudanças
    } catch (err) {
      console.error("Erro ao salvar processo:", err);
    }
  };

  const DeletarProcesso = async (id, idArea) => {
  if (window.confirm("Deseja realmente excluir este processo?")) {
    try {
      await axios.delete(`${serviceBase}/api/ProcessoById?id=${id}`);
      VerProcessos(idArea); // Recarrega a árvore
    } catch (err) {
      alert("Erro ao deletar: verifique se existem subprocessos vinculados.", err);
    }
  }
};

  const colunas = [];

  /* ---GET TODAS AS ÁREAS CADASTRADAS--- */
  const carregarAreas = () => {
    axios
      .get(`${serviceBase}/api/AllArea`)
      .then((res) => setAreas(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    carregarAreas();
  }, []);

  {
    /* ---CRIAR NOVA ÁREA--- */
  }

  const CriarNovaArea = async (e) => {
    e.preventDefault();
    try {
      const dados = {
        nome: nomeAreaCriacao,
        id_usuario_criacao: 0,
      };

      await axios.post(`${serviceBase}/api/CreateArea`, dados);

      setModalCriarOpen(false);
      setNomeAreaCriacao("");

      carregarAreas();
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  {
    /* ---EDITAR ÁREA--- */
  }
  const Editar = (area) => {
    setAreaParaEditar(area);
    setNovoNome(area.nome);
    setModalEditarOpen(true);
  };

  const SalvarEdicao = async (e) => {
    e.preventDefault();
    try {
      const dados = {
        id: areaParaEditar.id,
        nome: novoNome,
        id_usuario_criacao: 0,
      };

      await axios.put(`${serviceBase}/api/UpdateArea?id=${dados.id}`, dados);

      setModalEditarOpen(false);

      carregarAreas();
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  {
    /* ---DELETAR AREA--- */
  }
  const Deletar = (area) => {
    setAreaParaDeletar(area);
    setModalDeletarOpen(true);
  };

  const DeletarArea = async (e) => {
    e.preventDefault();
    try {
      const dados = {
        id: areaParaDeletar.id,
      };

      await axios.delete(`${serviceBase}/api/AreaById?id=${dados.id}`);

      setModalDeletarOpen(false);

      carregarAreas();
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  const VerProcessos = async (idArea) => {
    try { 
      const res = await axios.get(
        `${serviceBase}/api/GetProcess?IdArea=${idArea}`,
      );
      setProcessosDaArea(res.data);
      setModalArvoreOpen(true);
    } catch (err) {
      console.error("Erro ao carregar árvore:", err);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={headerStyle}>
        <h2 style={{ color: "#1e293b", margin: 0 }}>
          🏢 Gerenciamento de Áreas
        </h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="btn-action btn-success"
            onClick={() => setModalCriarOpen(true)}
          >
            ➕ Nova Área
          </button>
          <button
            className="btn-action btn-outline"
            onClick={() => navigate("/")}
          >
            ⬅️ Voltar Home
          </button>
        </div>
      </div>
      {/* --- GRID ÁREAS CADASTRADAS --- */}
      <Grid
        data={areas}
        columns={colunas}
        onEdit={Editar}
        onDelete={Deletar}
        onCreateProcess={AbrirModalCriarProcesso}
        onListProcesses={VerProcessos}
      />

      {/* --- MODAL CRIAR ÁREA--- */}
      <Modal
        isOpen={ModalCriar}
        onClose={() => setModalCriarOpen(false)}
        title="Criar Nova Área"
      >
        <form onSubmit={CriarNovaArea}>
          <label>Nome da Área:</label>
          <input
            type="text"
            style={inputStyle}
            value={nomeAreaCriacao}
            onChange={(e) => setNomeAreaCriacao(e.target.value)}
            required
          />
          <div style={footerButtons}>
            <button type="submit" style={btnSalvarStyle}>
              Criar
            </button>
            <button
              type="button"
              onClick={() => setModalCriarOpen(false)}
              style={btnCancelarStyle}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL EDITAR ÁREA--- */}
      <Modal
        isOpen={ModalEditar}
        onClose={() => setModalEditarOpen(false)}
        title="Editar Área"
      >
        <form onSubmit={SalvarEdicao}>
          <label>Nome da Área:</label>
          <input
            type="text"
            style={inputStyle}
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            required
          />
          <div style={footerButtons}>
            <button type="submit" style={btnSalvarStyle}>
              Salvar
            </button>
            <button
              type="button"
              onClick={() => setModalEditarOpen(false)}
              style={btnCancelarStyle}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      {/* --- MODAL DELETAR ÁREA--- */}
      <Modal
        isOpen={ModalDeletar}
        onClose={() => setModalDeletarOpen(false)}
        title="Deletar Área"
      >
        <form onSubmit={DeletarArea}>
          <label>
            Tem certeza que deseja deletar a área{" "}
            <strong>{areaParaDeletar.nome}</strong>?
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={footerButtons}>
              <button type="submit" style={btnSalvarStyle}>
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setModalDeletarOpen(false)}
                style={btnCancelarStyle}
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </Modal>
      {/* --- MODAL ÁRVORE DE PROCESSOS DA ÁREA --- */}
      <Modal
        isOpen={ModalArvore}
        onClose={() => setModalArvoreOpen(false)}
        title="Processos da área"
      >
        <div style={{ maxHeight: "70vh", overflowY: "auto", padding: "10px" }}>
          {processosDaArea.length > 0 ? (
            processosDaArea.map((p) => (
              <ArvoreProcessos
                key={p.id}
                processo={p}
                onAdd={AbrirModalCriarProcesso}
                onEdit={AbrirModalEditarProcesso}
                onDelete={(id) => DeletarProcesso(id, p.idArea)}
              />
            ))
          ) : (
            <p>Nenhum processo mapeado para esta área.</p>
          )}
        </div>
      </Modal>
         
        <Modal
        isOpen={ModalProcesso}
        onClose={() => setModalProcessoOpen(false)}
        title={modoEdicaoProcesso ? "Editar Processo" : "Novo Processo / Subprocesso"}
      >
        <div style={scrollContainerStyle}>
          <form onSubmit={SalvarProcesso}>
            <div style={{ display: 'grid', gap: '10px' }}>
              <label style={labelStyle}>Nome:</label>
              <input 
                style={inputStyle}  
                value={formProcesso.nome} 
                onChange={e => setFormProcesso({...formProcesso, nome: e.target.value})} 
                required 
              />

              <label style={labelStyle}>Descrição:</label>
              <textarea 
                style={inputStyle} 
                value={formProcesso.descricao} 
                onChange={e => setFormProcesso({...formProcesso, descricao: e.target.value})} 
              />

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={formProcesso.isSistemico} 
                    onChange={e => setFormProcesso({...formProcesso, isSistemico: e.target.checked})} 
                  /> É Sistêmico?
                </label>
              </div>

              <label style={labelStyle}>Ferramentas:</label>
              <input 
                style={inputStyle} 
                value={formProcesso.ferramentas} 
                onChange={e => setFormProcesso({...formProcesso, ferramentas: e.target.value})} 
              />
              <label style={labelStyle}>Responsáveis:</label>
              <input 
                style={inputStyle} 
                value={formProcesso.responsaveis} 
                onChange={e => setFormProcesso({...formProcesso, responsaveis: e.target.value})} 
              />
              <label style={labelStyle}>Documentações:</label>
              <input 
                style={inputStyle} 
                value={formProcesso.documentacoes} 
                onChange={e => setFormProcesso({...formProcesso, documentacoes: e.target.value})} 
              />
            </div>

            <div style={footerButtons}>
              <button type="submit" style={btnSalvarStyle}>
                {modoEdicaoProcesso ? "Atualizar" : "Cadastrar"}
              </button>
              <button type="button" onClick={() => setModalProcessoOpen(false)} style={btnCancelarStyle}>
                Cancelar
              </button>
            </div>
          </form>
          </div>
        </Modal>
        
    </div>
  );
}

{
  /* --- CSS's --- */
}
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
  paddingBottom: "15px",
  borderBottom: "1px solid #e2e8f0", // Linha sutil para separar o título
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "8px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  boxSizing: "border-box", // Evita que o input passe da borda do modal
};

const btnSalvarStyle = {
  padding: "10px 24px",
  backgroundColor: "#10b981", // Verde Sólido
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const btnCancelarStyle = {
  padding: "10px 24px",
  backgroundColor: "#94a3b8", // Cinza Sólido
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

const footerButtons = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "30px",
};
const scrollContainerStyle = {
  maxHeight: "65vh", // Limita a altura a 65% da altura da tela
  overflowY: "auto",  // Ativa o scroll vertical apenas quando necessário
  paddingRight: "10px", // Espaço para a barra de scroll não ficar em cima do texto
  scrollbarWidth: "thin", // Deixa a barra mais fina (em navegadores modernos)
};

const labelStyle = {
  display: "block",
  marginTop: "10px",
  fontWeight: "600",
  color: "#475569",
  fontSize: "0.9rem"
};
