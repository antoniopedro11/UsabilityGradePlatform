"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronLeft,
  Save,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  GripVertical,
  AlertCircle,
  ClipboardList
} from "lucide-react";

// Tipos de dados
interface FormQuestion {
  id: string;
  text: string;
  type: string;
  required: boolean;
  options?: string[];
  description?: string;
}

interface FormTemplate {
  title: string;
  description: string;
  category: string;
  questions: FormQuestion[];
}

// Categorias disponíveis para formulários
const formCategories = [
  { id: "web", name: "Web" },
  { id: "mobile", name: "Mobile" },
  { id: "desktop", name: "Desktop" },
  { id: "accessibility", name: "Acessibilidade" },
  { id: "usability", name: "Usabilidade" },
  { id: "ux", name: "Experiência do Utilizador" },
];

// Tipos de perguntas disponíveis
const questionTypes = [
  { id: "text", name: "Texto Curto" },
  { id: "textarea", name: "Texto Longo" },
  { id: "radio", name: "Escolha Única" },
  { id: "checkbox", name: "Escolha Múltipla" },
  { id: "select", name: "Lista Suspensa" },
  { id: "scale", name: "Escala (1-5)" },
  { id: "boolean", name: "Sim/Não" },
];

export default function NewFormPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formTemplate, setFormTemplate] = useState<FormTemplate>({
    title: "",
    description: "",
    category: "",
    questions: []
  });
  
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Atualizar dados do formulário
  const updateFormField = (field: string, value: string) => {
    setFormTemplate(prev => ({
      ...prev,
      [field]: value
    }));
    setUnsavedChanges(true);
  };

  // Adicionar nova pergunta
  const addQuestion = () => {
    const newQuestion: FormQuestion = {
      id: `q-${Date.now()}`,
      text: "",
      type: "text",
      required: false
    };
    
    setFormTemplate(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    
    setCurrentQuestionIndex(formTemplate.questions.length);
    setUnsavedChanges(true);
  };

  // Atualizar pergunta
  const updateQuestion = (index: number, field: string, value: any) => {
    setFormTemplate(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value
      };
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
    setUnsavedChanges(true);
  };

  // Remover pergunta
  const removeQuestion = (index: number) => {
    setFormTemplate(prev => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions.splice(index, 1);
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
    
    if (currentQuestionIndex === index) {
      setCurrentQuestionIndex(null);
    } else if (currentQuestionIndex !== null && currentQuestionIndex > index) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
    
    setUnsavedChanges(true);
  };

  // Adicionar opção a uma pergunta
  const addOption = (questionIndex: number) => {
    setFormTemplate(prev => {
      const updatedQuestions = [...prev.questions];
      const question = updatedQuestions[questionIndex];
      
      if (!question.options) {
        question.options = [];
      }
      
      question.options.push("");
      
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
    setUnsavedChanges(true);
  };

  // Atualizar opção
  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setFormTemplate(prev => {
      const updatedQuestions = [...prev.questions];
      const question = updatedQuestions[questionIndex];
      
      if (question.options) {
        question.options[optionIndex] = value;
      }
      
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
    setUnsavedChanges(true);
  };

  // Remover opção
  const removeOption = (questionIndex: number, optionIndex: number) => {
    setFormTemplate(prev => {
      const updatedQuestions = [...prev.questions];
      const question = updatedQuestions[questionIndex];
      
      if (question.options) {
        question.options.splice(optionIndex, 1);
      }
      
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
    setUnsavedChanges(true);
  };

  // Mover pergunta para cima
  const moveQuestionUp = (index: number) => {
    if (index === 0) return;
    
    setFormTemplate(prev => {
      const updatedQuestions = [...prev.questions];
      const temp = updatedQuestions[index];
      updatedQuestions[index] = updatedQuestions[index - 1];
      updatedQuestions[index - 1] = temp;
      
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
    
    if (currentQuestionIndex === index) {
      setCurrentQuestionIndex(index - 1);
    } else if (currentQuestionIndex === index - 1) {
      setCurrentQuestionIndex(index);
    }
    
    setUnsavedChanges(true);
  };

  // Mover pergunta para baixo
  const moveQuestionDown = (index: number) => {
    if (index === formTemplate.questions.length - 1) return;
    
    setFormTemplate(prev => {
      const updatedQuestions = [...prev.questions];
      const temp = updatedQuestions[index];
      updatedQuestions[index] = updatedQuestions[index + 1];
      updatedQuestions[index + 1] = temp;
      
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
    
    if (currentQuestionIndex === index) {
      setCurrentQuestionIndex(index + 1);
    } else if (currentQuestionIndex === index + 1) {
      setCurrentQuestionIndex(index);
    }
    
    setUnsavedChanges(true);
  };

  // Salvar formulário
  const saveForm = async () => {
    // Validar formulário
    if (!formTemplate.title) {
      setError("O título do formulário é obrigatório.");
      return;
    }
    
    if (!formTemplate.category) {
      setError("A categoria do formulário é obrigatória.");
      return;
    }
    
    if (formTemplate.questions.length === 0) {
      setError("O formulário deve ter pelo menos uma pergunta.");
      return;
    }
    
    // Validar perguntas
    const invalidQuestions = formTemplate.questions.filter(q => !q.text);
    if (invalidQuestions.length > 0) {
      setError("Todas as perguntas devem ter um texto.");
      return;
    }
    
    // Validar opções para perguntas de escolha
    const choiceQuestions = formTemplate.questions.filter(q => 
      ['radio', 'checkbox', 'select'].includes(q.type)
    );
    
    for (const q of choiceQuestions) {
      if (!q.options || q.options.length < 2 || q.options.some(opt => !opt)) {
        setError(`A pergunta "${q.text}" deve ter pelo menos duas opções válidas.`);
        return;
      }
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Enviar dados para API
      console.log("Enviando formulário para API:", formTemplate);
      
      const response = await fetch("/api/admin/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formTemplate)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Erro ao salvar formulário");
      }
      
      console.log("Formulário salvo com sucesso:", responseData);
      
      // Redirecionar para lista de formulários após sucesso
      router.push("/admin/forms");
      
    } catch (error) {
      console.error("Erro ao salvar formulário:", error);
      setError(error instanceof Error ? error.message : "Ocorreu um erro ao salvar o formulário. Tente novamente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link href="/admin/forms" className="mr-4">
            <Button variant="ghost" className="h-8 w-8 p-0">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Novo Formulário de Avaliação</h1>
        </div>
        
        <Button 
          onClick={saveForm} 
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Salvando..." : "Salvar Formulário"}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configurações Básicas do Formulário */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-800 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-gray-200">Detalhes do Formulário</CardTitle>
              <CardDescription className="text-gray-400">
                Configure as informações básicas do formulário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="form-title" className="text-gray-300">Título</Label>
                <Input
                  id="form-title"
                  placeholder="Ex: Avaliação de Usabilidade Web"
                  value={formTemplate.title}
                  onChange={(e) => updateFormField('title', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-200"
                />
              </div>
              
              <div>
                <Label htmlFor="form-desc" className="text-gray-300">Descrição</Label>
                <Textarea
                  id="form-desc"
                  placeholder="Descreva o propósito deste formulário..."
                  value={formTemplate.description}
                  onChange={(e) => updateFormField('description', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-gray-200"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="form-category" className="text-gray-300">Categoria</Label>
                <Select 
                  value={formTemplate.category} 
                  onValueChange={(value: string) => updateFormField('category', value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    {formCategories.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id}
                        className="focus:bg-gray-700 focus:text-white"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Lista de Perguntas */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-200">Perguntas</CardTitle>
              <CardDescription className="text-gray-400">
                {formTemplate.questions.length === 0 
                  ? "Ainda não há perguntas neste formulário" 
                  : `${formTemplate.questions.length} perguntas adicionadas`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formTemplate.questions.map((question, index) => (
                  <div 
                    key={question.id}
                    className={`p-3 rounded-md border flex items-center ${
                      currentQuestionIndex === index 
                        ? 'bg-blue-900/20 border-blue-700' 
                        : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                    }`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    <div className="flex-1 truncate">
                      <p className="font-medium text-gray-200 truncate">
                        {question.text || <span className="italic text-gray-400">Sem título</span>}
                      </p>
                      <p className="text-xs text-gray-400">
                        {questionTypes.find(t => t.id === question.type)?.name || question.type}
                        {question.required && ' • Obrigatório'}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 text-gray-400 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveQuestionUp(index);
                        }}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 text-gray-400 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveQuestionDown(index);
                        }}
                        disabled={index === formTemplate.questions.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeQuestion(index);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={addQuestion}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Pergunta
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Editor de Pergunta */}
        <div className="lg:col-span-2">
          {currentQuestionIndex !== null && formTemplate.questions[currentQuestionIndex] ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-200">
                  Editar Pergunta #{currentQuestionIndex + 1}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure os detalhes desta pergunta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="question-text" className="text-gray-300">Texto da Pergunta</Label>
                  <Input
                    id="question-text"
                    placeholder="Digite a pergunta..."
                    value={formTemplate.questions[currentQuestionIndex].text}
                    onChange={(e) => updateQuestion(currentQuestionIndex, 'text', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-200"
                  />
                </div>
                
                <div>
                  <Label htmlFor="question-desc" className="text-gray-300">Descrição (opcional)</Label>
                  <Textarea
                    id="question-desc"
                    placeholder="Adicione uma descrição ou instruções..."
                    value={formTemplate.questions[currentQuestionIndex].description || ''}
                    onChange={(e) => updateQuestion(currentQuestionIndex, 'description', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-200"
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="question-type" className="text-gray-300">Tipo de Resposta</Label>
                  <Select 
                    value={formTemplate.questions[currentQuestionIndex].type} 
                    onValueChange={(value: string) => updateQuestion(currentQuestionIndex, 'type', value)}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-200">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                      {questionTypes.map((type) => (
                        <SelectItem 
                          key={type.id} 
                          value={type.id}
                          className="focus:bg-gray-700 focus:text-white"
                        >
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="question-required"
                    checked={formTemplate.questions[currentQuestionIndex].required}
                    onCheckedChange={(checked: boolean) => 
                      updateQuestion(currentQuestionIndex, 'required', checked)
                    }
                  />
                  <Label htmlFor="question-required" className="text-gray-300">
                    Resposta obrigatória
                  </Label>
                </div>
                
                {/* Opções para perguntas de escolha */}
                {['radio', 'checkbox', 'select'].includes(formTemplate.questions[currentQuestionIndex].type) && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-gray-300">Opções de Resposta</Label>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => addOption(currentQuestionIndex)}
                        className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Adicionar Opção
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {formTemplate.questions[currentQuestionIndex].options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <div className="flex-1">
                            <Input
                              value={option}
                              placeholder={`Opção ${optionIndex + 1}`}
                              onChange={(e) => updateOption(currentQuestionIndex, optionIndex, e.target.value)}
                              className="bg-gray-700 border-gray-600 text-gray-200"
                            />
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                            onClick={() => removeOption(currentQuestionIndex, optionIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      {(!formTemplate.questions[currentQuestionIndex].options || 
                        formTemplate.questions[currentQuestionIndex].options.length === 0) && (
                        <p className="text-sm text-gray-400 italic">
                          Adicione pelo menos duas opções de resposta.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-800 rounded-lg border border-gray-700 p-8">
              <ClipboardList className="h-16 w-16 text-gray-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-300 mb-2">
                {formTemplate.questions.length === 0 
                  ? "Sem perguntas" 
                  : "Selecione uma pergunta"
                }
              </h3>
              <p className="text-gray-400 text-center mb-6">
                {formTemplate.questions.length === 0 
                  ? "Adicione perguntas ao seu formulário para começar"
                  : "Clique em uma pergunta na lista para editá-la"
                }
              </p>
              {formTemplate.questions.length === 0 && (
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={addQuestion}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeira Pergunta
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 