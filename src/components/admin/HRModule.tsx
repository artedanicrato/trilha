import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Clock, 
  DollarSign, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  Trash2, 
  Edit2, 
  Phone, 
  Briefcase,
  X
} from 'lucide-react';

export interface Employee {
  id: string;
  name: string;
  cpf: string;
  role: string;
  department: 'GRAFICA' | 'INFORMATICA' | 'ATENDIMENTO' | 'ADMIN';
  contractType: 'CLT' | 'PJ' | 'ESTAGIO';
  baseSalary: number;
  commissionRate: number; // percentage on graphic sales
  phone: string;
  admissionDate: string;
  shift: string;
  status: 'ATIVO' | 'FERIAS' | 'AFASTADO';
}

export interface TimePunch {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  entryTime: string;
  lunchStart: string;
  lunchEnd: string;
  exitTime: string;
  extraHours: number;
  status: 'NORMAL' | 'ATRASO' | 'EXTRA';
}

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Lucas Pinheiro Alencar',
    cpf: '048.912.384-55',
    role: 'Designer Gráfico & Especialista Sublimação',
    department: 'GRAFICA',
    contractType: 'CLT',
    baseSalary: 2450.00,
    commissionRate: 3.0,
    phone: '(88) 99812-4011',
    admissionDate: '15/02/2023',
    shift: '08:00 às 17:30 (Seg a Sex)',
    status: 'ATIVO',
  },
  {
    id: 'emp-2',
    name: 'Carla Menezes dos Santos',
    cpf: '052.718.993-21',
    role: 'Operadora de Prensa Térmica & DTF',
    department: 'GRAFICA',
    contractType: 'CLT',
    baseSalary: 1890.00,
    commissionRate: 2.5,
    phone: '(88) 99654-8233',
    admissionDate: '10/08/2023',
    shift: '08:30 às 18:00 (Seg a Sex)',
    status: 'ATIVO',
  },
  {
    id: 'emp-3',
    name: 'Rafael Bezerra Cordeiro',
    cpf: '039.441.872-90',
    role: 'Técnico em Hardware & Eletrônicos',
    department: 'INFORMATICA',
    contractType: 'PJ',
    baseSalary: 2200.00,
    commissionRate: 5.0,
    phone: '(88) 99741-2099',
    admissionDate: '01/04/2024',
    shift: '09:00 às 18:00 (Seg a Sáb)',
    status: 'ATIVO',
  },
  {
    id: 'emp-4',
    name: 'Juliana Siqueira Lima',
    cpf: '061.325.801-44',
    role: 'Atendente de Balcão & Caixa',
    department: 'ATENDIMENTO',
    contractType: 'CLT',
    baseSalary: 1650.00,
    commissionRate: 1.5,
    phone: '(88) 99225-5256',
    admissionDate: '20/11/2023',
    shift: '08:00 às 17:00 (Seg a Sáb)',
    status: 'ATIVO',
  },
];

const INITIAL_PUNCHES: TimePunch[] = [
  {
    id: 'punch-1',
    employeeId: 'emp-1',
    employeeName: 'Lucas Pinheiro Alencar',
    date: 'Hoje (04/10)',
    entryTime: '07:58',
    lunchStart: '12:00',
    lunchEnd: '13:00',
    exitTime: '17:35',
    extraHours: 0.5,
    status: 'NORMAL',
  },
  {
    id: 'punch-2',
    employeeId: 'emp-2',
    employeeName: 'Carla Menezes dos Santos',
    date: 'Hoje (04/10)',
    entryTime: '08:25',
    lunchStart: '12:00',
    lunchEnd: '13:00',
    exitTime: '18:02',
    extraHours: 0.0,
    status: 'NORMAL',
  },
  {
    id: 'punch-3',
    employeeId: 'emp-4',
    employeeName: 'Juliana Siqueira Lima',
    date: 'Hoje (04/10)',
    entryTime: '07:55',
    lunchStart: '12:30',
    lunchEnd: '13:30',
    exitTime: '17:00',
    extraHours: 0.0,
    status: 'NORMAL',
  },
];

export const HRModule: React.FC = () => {
  const [subTab, setSubTab] = useState<'EMPLOYEES' | 'TIMEPUNCH' | 'PAYROLL'>('EMPLOYEES');
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem('trilha_rh_employees');
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [timePunches, setTimePunches] = useState<TimePunch[]>(INITIAL_PUNCHES);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>('');

  // New Employee Form State
  const [newEmp, setNewEmp] = useState<Partial<Employee>>({
    name: '',
    cpf: '',
    role: '',
    department: 'GRAFICA',
    contractType: 'CLT',
    baseSalary: 1800,
    commissionRate: 2.0,
    phone: '(88) 9',
    admissionDate: new Date().toLocaleDateString('pt-BR'),
    shift: '08:00 às 18:00',
    status: 'ATIVO',
  });

  const saveEmployees = (list: Employee[]) => {
    setEmployees(list);
    try {
      localStorage.setItem('trilha_rh_employees', JSON.stringify(list));
    } catch {
      // Ignore
    }
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.cpf || !newEmp.role) {
      alert('Preencha os campos obrigatórios (Nome, CPF e Cargo)');
      return;
    }

    const created: Employee = {
      id: 'emp-' + Date.now(),
      name: newEmp.name,
      cpf: newEmp.cpf,
      role: newEmp.role,
      department: newEmp.department || 'GRAFICA',
      contractType: newEmp.contractType || 'CLT',
      baseSalary: Number(newEmp.baseSalary) || 1650,
      commissionRate: Number(newEmp.commissionRate) || 2,
      phone: newEmp.phone || '(88) 99225-5256',
      admissionDate: newEmp.admissionDate || new Date().toLocaleDateString('pt-BR'),
      shift: newEmp.shift || '08:00 às 18:00',
      status: 'ATIVO',
    };

    const updated = [created, ...employees];
    saveEmployees(updated);
    setIsAddModalOpen(false);
    setNewEmp({
      name: '',
      cpf: '',
      role: '',
      department: 'GRAFICA',
      contractType: 'CLT',
      baseSalary: 1800,
      commissionRate: 2.0,
      phone: '(88) 9',
      admissionDate: new Date().toLocaleDateString('pt-BR'),
      shift: '08:00 às 18:00',
      status: 'ATIVO',
    });
    setNotification('Colaborador cadastrado com sucesso!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Tem certeza que deseja remover este colaborador?')) {
      const updated = employees.filter((e) => e.id !== id);
      saveEmployees(updated);
      setNotification('Colaborador removido.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const handleRegisterTimePunch = (emp: Employee) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newPunch: TimePunch = {
      id: 'punch-' + Date.now(),
      employeeId: emp.id,
      employeeName: emp.name,
      date: `Hoje (${new Date().toLocaleDateString('pt-BR')})`,
      entryTime: timeStr,
      lunchStart: '12:00',
      lunchEnd: '13:00',
      exitTime: '18:00',
      extraHours: 0,
      status: 'NORMAL',
    };
    setTimePunches([newPunch, ...timePunches]);
    setNotification(`Ponto registrado com sucesso para ${emp.name} às ${timeStr}!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleExportPayroll = () => {
    const lines = [
      'TRILHA SONORA GRAFICA & ELETRONICOS - CRATO CE',
      'RELATORIO DE FOLHA DE PAGAMENTO & RECURSOS HUMANOS',
      `Data de Emissao: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`,
      '---------------------------------------------------------------------------------',
      'ID | NOME | CARGO | REGIME | SALARIO BASE | COMISSAO EST. | TOTAL BRUTO',
      '---------------------------------------------------------------------------------',
      ...employees.map((e) => {
        const comissao = (e.baseSalary * (e.commissionRate / 100)) + 120.00;
        const total = e.baseSalary + comissao;
        return `${e.id} | ${e.name} | ${e.role} | ${e.contractType} | R$ ${e.baseSalary.toFixed(2)} | R$ ${comissao.toFixed(2)} | R$ ${total.toFixed(2)}`;
      }),
      '---------------------------------------------------------------------------------',
      `Total Geral de Folha: R$ ${employees.reduce((acc, e) => acc + e.baseSalary + ((e.baseSalary * (e.commissionRate / 100)) + 120), 0).toFixed(2)}`,
      'Encaminhado para a Contabilidade - Crato / CE',
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `folha-pagamento-trilhasonora-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#ff6600]/20 text-[#ff6600]">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Módulo de Recursos Humanos (RH)</h2>
              <p className="text-xs text-slate-400">
                Gestão da equipe da gráfica, técnicos, operadores de prensas e balcão em Crato - CE.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('EMPLOYEES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'EMPLOYEES'
                ? 'bg-[#004bbf] text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Equipe ({employees.length})
          </button>
          <button
            onClick={() => setSubTab('TIMEPUNCH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'TIMEPUNCH'
                ? 'bg-[#004bbf] text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Ponto Eletrônico
          </button>
          <button
            onClick={() => setSubTab('PAYROLL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === 'PAYROLL'
                ? 'bg-[#004bbf] text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Folha & Comissões
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* SUBTAB 1: EMPLOYEES LIST */}
      {subTab === 'EMPLOYEES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#ff944d]" />
              Quadro de Colaboradores Ativos
            </h3>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ff6600] hover:bg-[#ea580c] text-white text-xs font-bold transition-all shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Novo Funcionário</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {employees.map((emp) => (
              <div 
                key={emp.id} 
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-[#004bbf] border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                    {emp.name.charAt(0)}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    emp.status === 'ATIVO' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400'
                  }`}>
                    {emp.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white leading-snug">{emp.name}</h4>
                  <p className="text-xs text-[#ff944d] font-medium mt-0.5">{emp.role}</p>
                  <p className="text-[11px] text-slate-400">CPF: {emp.cpf}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1 text-slate-300">
                  <p className="flex justify-between">
                    <span className="text-slate-400">Contrato:</span>
                    <strong className="text-white">{emp.contractType}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Salário Base:</span>
                    <span className="font-mono text-emerald-400 font-semibold">R$ {emp.baseSalary.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Comissão p/ peça:</span>
                    <span className="font-mono text-orange-400 font-semibold">{emp.commissionRate}%</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Turno:</span>
                    <span className="text-slate-300 truncate max-w-[140px]">{emp.shift}</span>
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => handleRegisterTimePunch(emp)}
                    className="px-2 py-1 rounded bg-blue-950/80 hover:bg-blue-900 border border-blue-800/80 text-[11px] text-blue-300 font-semibold flex items-center gap-1 transition-colors"
                    title="Bater Ponto do dia"
                  >
                    <Clock className="w-3 h-3" />
                    Bater Ponto
                  </button>

                  <button
                    onClick={() => handleDeleteEmployee(emp.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 transition-colors"
                    title="Excluir Colaborador"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: TIME PUNCH / PONTO ELETRONICO */}
      {subTab === 'TIMEPUNCH' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Espelho de Ponto Eletrônico da Loja (Crato - CE)
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Tolerância CLT: 10 minutos diários
            </span>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Colaborador</th>
                    <th className="py-3 px-3">Data</th>
                    <th className="py-3 px-3">Entrada</th>
                    <th className="py-3 px-3">Almoço (Ida/Volta)</th>
                    <th className="py-3 px-3">Saída</th>
                    <th className="py-3 px-3">H. Extras</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {timePunches.map((tp) => (
                    <tr key={tp.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-white">{tp.employeeName}</td>
                      <td className="py-3 px-3 text-slate-400">{tp.date}</td>
                      <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{tp.entryTime}</td>
                      <td className="py-3 px-3 font-mono text-slate-300">{tp.lunchStart} - {tp.lunchEnd}</td>
                      <td className="py-3 px-3 font-mono text-blue-300 font-bold">{tp.exitTime}</td>
                      <td className="py-3 px-3 font-mono text-amber-400 font-bold">{tp.extraHours}h</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          CONFORME
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: PAYROLL & COMMISSIONS */}
      {subTab === 'PAYROLL' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Demonstrativo de Folha de Pagamento & Comissões de Produção
              </h3>
              <p className="text-xs text-slate-400">
                Cálculo com base no fechamento mensal para envio ao escritório contábil.
              </p>
            </div>

            <button
              onClick={handleExportPayroll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar p/ Contabilidade</span>
            </button>
          </div>

          <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Colaborador</th>
                    <th className="py-3 px-3">Cargo / Setor</th>
                    <th className="py-3 px-3">Salário Base</th>
                    <th className="py-3 px-3">Comissão Produção</th>
                    <th className="py-3 px-3">D.S.R & Bônus</th>
                    <th className="py-3 px-3">Descontos (INSS)</th>
                    <th className="py-3 px-4 font-bold text-right">Líquido a Pagar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {employees.map((emp) => {
                    const comissao = (emp.baseSalary * (emp.commissionRate / 100)) + 140.00;
                    const dsr = comissao * 0.15;
                    const inss = emp.contractType === 'CLT' ? emp.baseSalary * 0.085 : 0;
                    const liquido = emp.baseSalary + comissao + dsr - inss;

                    return (
                      <tr key={emp.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">
                          {emp.name}
                          <span className="block text-[10px] text-slate-500 font-normal">CPF: {emp.cpf}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-400">
                          {emp.role}
                          <span className="block text-[10px] text-blue-400 font-bold">{emp.contractType}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-white">R$ {emp.baseSalary.toFixed(2)}</td>
                        <td className="py-3 px-3 font-mono text-amber-400 font-semibold">+ R$ {comissao.toFixed(2)}</td>
                        <td className="py-3 px-3 font-mono text-emerald-400 font-semibold">+ R$ {dsr.toFixed(2)}</td>
                        <td className="py-3 px-3 font-mono text-rose-400">- R$ {inss.toFixed(2)}</td>
                        <td className="py-3 px-4 font-mono font-bold text-right text-emerald-400 text-sm">
                          R$ {liquido.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE EMPLOYEE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#ff6600]" />
                Cadastrar Colaborador Trilha Sonora
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                  placeholder="Ex: Carlos Eduardo de Oliveira"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#ff6600]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">CPF *</label>
                  <input
                    type="text"
                    required
                    value={newEmp.cpf}
                    onChange={(e) => setNewEmp({ ...newEmp, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#ff6600]"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={newEmp.phone}
                    onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })}
                    placeholder="(88) 99225-5256"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#ff6600]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Cargo *</label>
                  <input
                    type="text"
                    required
                    value={newEmp.role}
                    onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}
                    placeholder="Ex: Operador de Sublimação"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#ff6600]"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Regime Contratual</label>
                  <select
                    value={newEmp.contractType}
                    onChange={(e) => setNewEmp({ ...newEmp, contractType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#ff6600]"
                  >
                    <option value="CLT">CLT (Carteira Assinada)</option>
                    <option value="PJ">PJ (Prestador de Serviços)</option>
                    <option value="ESTAGIO">Estágio Remunerado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Salário Base (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newEmp.baseSalary}
                    onChange={(e) => setNewEmp({ ...newEmp, baseSalary: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#ff6600]"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Comissão Gráfica (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newEmp.commissionRate}
                    onChange={(e) => setNewEmp({ ...newEmp, commissionRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#ff6600]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Escala / Turno de Trabalho</label>
                <input
                  type="text"
                  value={newEmp.shift}
                  onChange={(e) => setNewEmp({ ...newEmp, shift: e.target.value })}
                  placeholder="08:00 às 18:00 (Seg a Sex)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#ff6600]"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#ff6600] hover:bg-[#ea580c] text-white font-bold shadow-md"
                >
                  Salvar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
