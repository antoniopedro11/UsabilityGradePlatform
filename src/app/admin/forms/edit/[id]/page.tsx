"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown,
  AlertCircle,
  Loader2,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Question {
  id: string;
  text: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface FormData {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  questions: Question[];
}

const questionTypes = [
  { id: "text", name: "Texto" },
  { id: "textarea", name: "Texto longo" },
  { id: "radio", name: "Escolha única" },
  { id: "checkbox", name: "Múltipla escolha" },
  { id: "select", name: "Lista suspensa" },
  { id: "scale", name: "Escala" },
];

const categories = [
  { id: "web", name: "Usabilidade Web" },
  { id: "mobile", name: "Usabilidade Mobile" },
  { id: "ux", name: "Experiência do Usuário (UX)" },
  { id: "accessibility", name: "Acessibilidade" },
];

export default function EditFormPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;
  
  const [formData, setFormData] = useState<FormData>({
    id: "",
    title: "",
    description: "",
    category: "",
    status: "draft",
    questions: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Carregar dados do formulário
  useEffect(() => {
    const loadForm = async () => {
      setIsLoading(true);
      
      try {
        // Buscar dados do formulário da API
        const response = await fetch(`/api/admin/forms/${formId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Não foi possível carregar os dados do formulário");
        }
        
        const data = await response.json();
        
        // A API retorna os dados diretamente, não dentro de um objeto "form"
        if (data) {
          // Formatar os dados recebidos para o formato esperado pela UI
          const formattedData: FormData = {
            id: data.id,
            title: data.title,
            description: data.description || "",
            category: data.category,
            status: data.status,
            questions: data.questions.map((q: any) => ({
              id: q.id,
              text: q.text,
              type: q.type.toLowerCase(),
              required: q.required,
              options: q.options && q.options.length > 0 
                ? q.options.map((o: any) => typeof o === 'string' ? o : o.text)
                : undefined
            }))
          };
          
          setFormData(formattedData);
          console.log("Dados do formulário carregados:", formattedData);
        } else {
          throw new Error("Dados do formulário não encontrados");
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar formulário:", error);
        setMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Erro ao carregar o formulário. Tente novamente."
        });
        setIsLoading(false);
      }
    };
    
    if (formId) {
      loadForm();
    }
  }, [formId]);

  // Atualizar dados do formulário
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Atualizar categoria ou status
  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Atualizar uma pergunta
  const handleQuestionChange = (questionId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  };

  // Adicionar uma nova pergunta
  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      text: "Nova pergunta",
      type: "text",
      required: false
    };
    
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  // Remover uma pergunta
  const removeQuestion = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  // Mover pergunta para cima
  const moveQuestionUp = (index: number) => {
    if (index === 0) return;
    
    const updatedQuestions = [...formData.questions];
    [updatedQuestions[index - 1], updatedQuestions[index]] = 
      [updatedQuestions[index], updatedQuestions[index - 1]];
    
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  // Mover pergunta para baixo
  const moveQuestionDown = (index: number) => {
    if (index === formData.questions.length - 1) return;
    
    const updatedQuestions = [...formData.questions];
    [updatedQuestions[index], updatedQuestions[index + 1]] = 
      [updatedQuestions[index + 1], updatedQuestions[index]];
    
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  // Adicionar opção a pergunta de múltipla escolha
  const addOption = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId) {
          const options = q.options || [];
          return {
            ...q,
            options: [...options, `Opção ${options.length + 1}`]
          };
        }
        return q;
      })
    }));
  };

  // Remover opção de pergunta de múltipla escolha
  const removeOption = (questionId: string, optionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId && q.options) {
          return {
            ...q,
            options: q.options.filter((_, idx) => idx !== optionIndex)
          };
        }
        return q;
      })
    }));
  };

  // Atualizar texto de uma opção
  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => {
        if (q.id === questionId && q.options) {
          const updatedOptions = [...q.options];
          updatedOptions[optionIndex] = value;
          return {
            ...q,
            options: updatedOptions
          };
        }
        return q;
      })
    }));
  };

  // Salvar formulário
  const saveForm = async () => {
    setIsSaving(true);
    setMessage(null);
    
    try {
      // Validar dados do formulário
      if (!formData.title.trim()) {
        setMessage({
          type: "error",
          text: "O título do formulário é obrigatório."
        });
        setIsSaving(false);
        return;
      }
      
      // Verificar se há perguntas
      if (formData.questions.length === 0) {
        setMessage({
          type: "error",
          text: "O formulário deve ter pelo menos uma pergunta."
        });
        setIsSaving(false);
        return;
      }
      
      // Verificar se todas as perguntas têm texto
      for (const question of formData.questions) {
        if (!question.text.trim()) {
          setMessage({
            type: "error",
            text: "Todas as perguntas devem ter um texto."
          });
          setIsSaving(false);
          return;
        }
        
        // Verificar se perguntas de múltipla escolha têm opções
        if (["radio", "checkbox", "select"].includes(question.type) && 
            (!question.options || question.options.length < 2)) {
          setMessage({
            type: "error",
            text: `A pergunta "${question.text}" precisa ter pelo menos duas opções.`
          });
          setIsSaving(false);
          return;
        }
      }
      
      // Preparar dados para enviar à API no formato esperado
      const formPayload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        questions: formData.questions.map(question => ({
          id: question.id,
          text: question.text,
          type: question.type,
          required: question.required,
          options: question.options && question.options.length > 0 
            ? question.options.map(opt => typeof opt === 'string' 
                ? { text: opt } 
                : opt)
            : []
        }))
      };
      
      console.log("Enviando dados para a API:", formPayload);
      
      // Enviar dados para a API
      const response = await fetch(`/api/admin/forms/${formId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formPayload)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Erro ao atualizar formulário");
      }
      
      setMessage({
        type: "success",
        text: "Formulário atualizado com sucesso!"
      });
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/admin/forms");
      }, 2000);
      
    } catch (error) {
      console.error("Erro ao salvar formulário:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Erro ao salvar o formulário. Tente novamente."
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-500" />
          <p className="text-gray-600 dark:text-gray-400">Carregando formulário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push("/admin/forms")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Editar Formulário</h1>
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded-md flex items-start ${
          message.type === "error" 
            ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200" 
            : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
        }`}>
          {message.type === "error" ? (
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          ) : (
            <div className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
          <p>{message.text}</p>
        </div>
      )}
      
      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Informações gerais sobre o formulário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Formulário</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="mt-1"
                placeholder="Ex: Avaliação de Usabilidade do Site"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="mt-1"
                placeholder="Descreva o propósito do formulário"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange(value, "category")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange(value, "status")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="archived">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Perguntas</CardTitle>
              <CardDescription>Perguntas do formulário</CardDescription>
            </div>
            <Button onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Pergunta
            </Button>
          </CardHeader>
          <CardContent>
            {formData.questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Nenhuma pergunta adicionada ainda. Clique em "Adicionar Pergunta" para começar.
              </div>
            ) : (
              <div className="space-y-6">
                {formData.questions.map((question, index) => (
                  <Card key={question.id} className="border border-gray-200 dark:border-gray-700">
                    <CardHeader className="bg-gray-50 dark:bg-gray-800 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="w-full">
                          <div className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Pergunta {index + 1}
                          </div>
                          <Input
                            value={question.text}
                            onChange={(e) => handleQuestionChange(question.id, "text", e.target.value)}
                            placeholder="Texto da pergunta"
                            className="font-medium"
                          />
                        </div>
                        <div className="flex space-x-1 ml-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => moveQuestionUp(index)}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => moveQuestionDown(index)}
                            disabled={index === formData.questions.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor={`question-type-${question.id}`}>Tipo de Pergunta</Label>
                          <Select
                            value={question.type}
                            onValueChange={(value) => handleQuestionChange(question.id, "type", value)}
                          >
                            <SelectTrigger className="mt-1" id={`question-type-${question.id}`}>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {questionTypes.map(type => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-8">
                          <Switch
                            id={`required-${question.id}`}
                            checked={question.required}
                            onCheckedChange={(checked) => 
                              handleQuestionChange(question.id, "required", checked)
                            }
                          />
                          <Label htmlFor={`required-${question.id}`}>Pergunta obrigatória</Label>
                        </div>
                      </div>
                      
                      {/* Opções para perguntas de múltipla escolha */}
                      {["radio", "checkbox", "select"].includes(question.type) && (
                        <div className="mt-4">
                          <div className="flex justify-between items-center mb-2">
                            <Label>Opções</Label>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => addOption(question.id)}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Adicionar Opção
                            </Button>
                          </div>
                          
                          {question.options && question.options.length > 0 ? (
                            <div className="space-y-2">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center">
                                  <Input
                                    value={option}
                                    onChange={(e) => 
                                      updateOption(question.id, optIndex, e.target.value)
                                    }
                                    placeholder={`Opção ${optIndex + 1}`}
                                    className="mr-2"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeOption(question.id, optIndex)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Nenhuma opção adicionada. Clique em "Adicionar Opção".
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button
          variant="outline"
          className="mr-4"
          onClick={() => router.push("/admin/forms")}
        >
          Cancelar
        </Button>
        <Button 
          onClick={saveForm}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Formulário
            </>
          )}
        </Button>
      </div>
    </div>
  );
} 