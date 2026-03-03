import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Grid from "../components/Grid";
import Modal from "../components/Modal";
import ArvoreProcessos from "../components/ArvoreProcessos";

/* --- Definição do service base (Endereço do BackEnd) --- */
const serviceBase = "https://localhost:7064";

export default function ListagemAreas() {
  const [areas, setAreas] = useState([]);
  const navigate = useNavigate();

  const [ModalCriar, setModalCriarOpen] = useState(false);
  const [ModalEditar, setModalEditarOpen] = useState(false);
  const [ModalDeletar, setModalDeletarOpen] = useState(false);
  const [ModalArvore, setModalArvoreOpen] = useState(false);

  const [nomeAreaCriacao, setNomeAreaCriacao] = useState("");
  const [areaParaEditar, setAreaParaEditar] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [areaParaDeletar, setAreaParaDeletar] = useState("");
  const [processosDaArea, setProcessosDaArea] = useState([]);

  const [ModalProcesso, setModalProcessoOpen] = useState(false);
  const [modoEdicaoProcesso, setModoEdicaoProcesso] = useState(false);  

  const [modalDeletarProcesso, setModalDeletarProcessoOpen] = useState(false);
  const [processoParaDeletar, setProcessoParaDeletar] = useState({ id: null, nome: "", idArea: null });

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

  /* --- Função para abrir o modal de criação de processos e setar variaveis para a ação--- */
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

  /* --- Função para abrir o modal de edição de processos e setar variaveis para a ação OBS: Herda as informações do processo que o usuário deseja alterar --- */
  const AbrirModalEditarProcesso = (processo) => {
    setModoEdicaoProcesso(true);
    setFormProcesso({ ...processo });
    setModalProcessoOpen(true);
  };

  const AbrirConfirmacaoDeletarProcesso = (processo) => {

  console.log("processo:", processo);
  setProcessoParaDeletar({ processo });
  setModalDeletarProcessoOpen(true);
};
  
  /* ---FUNÇÃO QUE CHAMA API PARA ATUALIZAR OU CRIAR UM PROCESSO --OBS: VALIDA SE A AÇÃO É UMA EDIÇÃO OU UMA CRIAÇÃO --- */
  const SalvarProcesso = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicaoProcesso) {
        await axios.put(`${serviceBase}/api/UpdateProcess?id=${formProcesso.id}`, formProcesso)
          .then((response) => toast.success(response.data.message))
          .catch((error) => toast.error(error.data.message)
        );

      } else {
        await axios.post(`${serviceBase}/api/CreateProcess`, formProcesso)
          .then((response) => toast.success(response.data.message))
          .catch((error) => toast.error(error.data.message)
        );
      }

      setModalProcessoOpen(false);
      VerProcessos(formProcesso.idArea);
    } catch (error) {
      console.error("Erro ao concluir ação:", error);
    }
  };

  /* ---FUNÇÃO QUE CHAMA API PARA DELETAR UM PROCESSO --- */
  const DeletarProcesso = async (obj) => {
   try {
      const idProcesso = obj.processo.id;
      const idArea = obj.processo.idArea;

      await axios.delete(`${serviceBase}/api/ProcessoById?id=${idProcesso}`)
        .then((response) => toast.success(response.data.message))
        .catch((error) => toast.error(error.data.message)
      );
      
      VerProcessos(idArea);
    } catch (err) {
      console.error("Erro ao remover:", err);
    }
};

  const colunas = [];

  /* --- Função para buscar todas as áreas cadastradas --- */
  const carregarAreas = async () => {
    await axios.get(`${serviceBase}/api/AllArea`)
      .then((res) => setAreas(res.data))
      .catch(() => setAreas()
    );
  };
 /* --- Chamar a função das áreas caso ocorra alguma mudança - Renderiza -- */
  useEffect(() => {
    carregarAreas();
  }, []);

  
  /* --- FUNÇÃO QUE CHAMA API PARA CRIAR NOVA ÁREA --- */
  const CriarNovaArea = async (e) => {
    e.preventDefault();
    try {
      const dados = {
        nome: nomeAreaCriacao,
        id_usuario_criacao: 0,
      };

      await axios.post(`${serviceBase}/api/CreateArea`, dados)
        .then((response) => toast.success(response.data.message))
        .catch((error) => toast.error(error.data.message)
      );

      setModalCriarOpen(false);
      setNomeAreaCriacao("");

      carregarAreas();
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  /* --- FUNÇÃO PARA ABRIR O MODAL DE EDIÇÃO DE ÁREA E SETAR AS VARIAVEIS --- */
  const Editar = (area) => {
    setAreaParaEditar(area);
    setNovoNome(area.nome);
    setModalEditarOpen(true);
  };

  /* --- FUNÇÃO QUE CHAMA API PARA SALVAR A ATUALIZAÇÃO DE UMA ÁREA --- */
  const SalvarEdicao = async (e) => {
    e.preventDefault();
    try {
      const dados = {
        id: areaParaEditar.id,
        nome: novoNome,
        id_usuario_criacao: 0,
      };

      await axios.put(`${serviceBase}/api/UpdateArea?id=${dados.id}`, dados)
        .then((response) => toast.success(response.data.message))
        .catch((error) => toast.error(error.data.message)
      );

      setModalEditarOpen(false);

      carregarAreas();
    } catch (err) {
      console.error("Erro ao salvar:", err);
    }
  };

  
  /* --- FUNÇÃO PARA ABRIR O MODAL PARA DELETAR ÁREA E SETAR AS VARIAVEIS --- */  
  const Deletar = (area) => {
    setAreaParaDeletar(area);
    setModalDeletarOpen(true);
  };

   /* --- FUNÇÃO QUE CHAMA API PARA DELETAR UMA ÁREA --- */
  const DeletarArea = async (e) => {
    e.preventDefault();
    try {
      const dados = {
        id: areaParaDeletar.id,
      };

      await axios.delete(`${serviceBase}/api/AreaById?id=${dados.id}`)      
        .then((response) => toast.success(response.data.message))
        .catch((error) => toast.error(error.data.message)
      );

      carregarAreas();

      setModalDeletarOpen(false);
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  /* --- FUNÇÃO QUE CHAMA API QUE DA UM GET EM TODOS OS PROCESSOS DE UMA ÁREA --- */
  const VerProcessos = async (idArea) => {
    try { 
      const res = await axios.get(
        `${serviceBase}/api/GetProcess?IdArea=${idArea}`,
      );
      setProcessosDaArea(res.data);
      setModalArvoreOpen(true);
    } catch (error) {
      const msg = error.response?.data?.message || "Erro ao carregar a árvore de processos";
      toast.error(msg);
      setModalArvoreOpen(false);
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
      {/* --- GRID DE ÁREAS CADASTRADAS --- */}
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
        title="⚠️ Deletar Área"
      >
        <form onSubmit={DeletarArea}>
          <label>
            Tem certeza que deseja deletar a área{" "}
            <strong>{areaParaDeletar.nome}</strong>?
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={footerButtons}>
              <button type="submit" style={{ ...btnSalvarStyle, backgroundColor: "#d9534f", borderColor: "#d43f3a" }}>
                Sim, deletar
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
                onDelete={(processosDaArea) => AbrirConfirmacaoDeletarProcesso(processosDaArea)}
              />
            ))
          ) : (
            <p>Nenhum processo mapeado para esta área.</p>
          )}
        </div>
      </Modal>

      {/* --- MODAL PARA CRIAR E ATUALZIAR UM PROCESSO (MESMO MODAL PARA ATUALZIAR E CRIAR UM PROCESSO) --- */}
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
                /> Processo sistêmico?
              </label>
            </div>

            <label style={labelStyle}>Sistemas / Ferramentas:</label>
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
        
      {/* --- MODAL CONFIRMAÇÃO DELETAR PROCESSO --- */}
      <Modal
        isOpen={modalDeletarProcesso}
        onClose={() => setModalDeletarProcessoOpen(false)}
        title="⚠️ Atenção: Excluir Processo"
      >
        <div style={{ padding: "10px" }}>
          <p style={{ fontSize: "16px", marginBottom: "15px" }}>
            Tem certeza que deseja excluir: <strong>{processoParaDeletar?.processo?.nome}</strong>?
          </p>

          <div style={{ 
            backgroundColor: "#fff5f5", 
            borderLeft: "4px solid #f56565", 
            padding: "12px", 
            marginBottom: "20px" 
          }}>
            <p style={{ color: "#c53030", margin: 0, fontSize: "14px", fontWeight: "bold" }}>
              🚨 Importante:
            </p>
            <p style={{ color: "#c53030", margin: 0, fontSize: "14px" }}>
              Ao excluir este processo, <strong>todos os subprocessos vinculados a ele também serão removidos permanentemente.</strong>
            </p>
          </div>

          <div style={footerButtons}>
            <button
              onClick={() => {
                DeletarProcesso(processoParaDeletar);
                setModalDeletarProcessoOpen(false);
              }}
              style={{ ...btnSalvarStyle, backgroundColor: "#d9534f", borderColor: "#d43f3a" }}
            >
              Sim, excluir
            </button>
            <button
              type="button"
              onClick={() => setModalDeletarProcessoOpen(false)}
              style={btnCancelarStyle}
            >
              Cancelar
            </button>
          </div>
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
