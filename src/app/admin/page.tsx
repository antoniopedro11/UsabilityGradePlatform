"use client";

import React from "react";
import Link from "next/link";
import { FaUsers, FaChartBar, FaCog, FaClipboardList, FaBook, FaLayerGroup } from "react-icons/fa";
import { Users, BookText, ClipboardList, Layers } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/users" className="block">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-blue-500 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-900 flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-200">Gestão de Utilizadores</h2>
                </div>
                <p className="text-gray-300">
                  Ver, editar, e gerir contas de utilizadores. Promover utilizadores a administradores.
                </p>
              </div>
            </Link>
            
            <Link href="/admin/forms" className="block">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-blue-500 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center mr-4">
                    <ClipboardList className="h-6 w-6 text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-200">Formulários de Avaliação</h2>
                </div>
                <p className="text-gray-300">
                  Criar e gerir formulários de avaliação com perguntas personalizadas.
                </p>
              </div>
            </Link>
            
            <Link href="/admin/knowledge" className="block">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-blue-500 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-900 flex items-center justify-center mr-4">
                    <BookText className="h-6 w-6 text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-200">Base de Conhecimento</h2>
                </div>
                <p className="text-gray-300">
                  Gerir artigos e recursos da base de conhecimento para auxiliar os utilizadores.
                </p>
              </div>
            </Link>
            
            <Link href="/admin/templates" className="block">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 hover:border-blue-500 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-900 flex items-center justify-center mr-4">
                    <Layers className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-200">Templates</h2>
                </div>
                <p className="text-gray-300">
                  Criar e gerir templates de formulários para diferentes tipos de avaliação.
                </p>
              </div>
            </Link>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-900 flex items-center justify-center mr-4">
                  <FaChartBar className="h-5 w-5 text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-200">Estatísticas</h2>
              </div>
              <p className="text-gray-300">
                Visualize estatísticas e métricas do sistema.
              </p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-900 flex items-center justify-center mr-4">
                  <FaCog className="h-5 w-5 text-yellow-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-200">Configurações</h2>
              </div>
              <p className="text-gray-300">
                Configure as definições do sistema.
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Resumo do Sistema</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-gray-500 text-sm uppercase">Total de Utilizadores</h3>
                  <p className="text-2xl font-bold">12</p>
                </div>
                
                <div>
                  <h3 className="text-gray-500 text-sm uppercase">Especialistas</h3>
                  <p className="text-2xl font-bold">3</p>
                </div>
                
                <div>
                  <h3 className="text-gray-500 text-sm uppercase">Empresariais</h3>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <ul className="divide-y divide-gray-200">
                <li className="p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">RP</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Ricardo Pereira</p>
                      <p className="text-sm text-gray-500">Novo utilizador registrado</p>
                    </div>
                    <div className="text-sm text-gray-500">Há 2 horas</div>
                  </div>
                </li>
                <li className="p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 font-medium">MS</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Maria Silva</p>
                      <p className="text-sm text-gray-500">Alterou perfil de utilizador</p>
                    </div>
                    <div className="text-sm text-gray-500">Há 5 horas</div>
                  </div>
                </li>
                <li className="p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 font-medium">AP</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Admin Principal</p>
                      <p className="text-sm text-gray-500">Excluiu utilizador inativo</p>
                    </div>
                    <div className="text-sm text-gray-500">Ontem</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 