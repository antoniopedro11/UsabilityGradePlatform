"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  AlertCircle, 
  Loader2,
  CheckCircle,
  Info
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
import { Badge } from "@/components/ui/badge";
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

export default function PreviewFormPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;
  
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);
  
  // Carregar dados do formulário
  useEffect(() => {
    const loadForm = async () => {
      setIsLoading(true);
      console.log(`Tentando carregar o formulário com ID: ${formId}`);
      
      try {
        // Carregar dados do formulário da API
        console.log(`Fazendo fetch para a API: /api/admin/forms/${formId}`);
        const response = await fetch(`/api/admin/forms/${formId}`);
        console.log(`Resposta da API recebida - Status: ${response.status}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro na resposta da API:", errorData);
          throw new Error(errorData.error || "Não foi possível carregar os dados do formulário");
        }
        
        const data = await response.json();
        console.log("Dados recebidos da API:", data);
        
        // Formatar as perguntas para o formato esperado pela UI
        if (data) {
          // Transformar os dados se necessário
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
          
          console.log("Dados formatados:", formattedData);
          setFormData(formattedData);
        } else {
          console.error("Dados do formulário vazios ou indefinidos");
          throw new Error("Dados do formulário não encontrados");
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar formulário:", error);
        setMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Erro ao carregar o formulário"
        });
        setIsLoading(false);
      }
    };
    
    if (formId) {
      loadForm();
    }
  }, [formId]);

  // Manipular mudanças nas respostas
  const handleResponseChange = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Limpar erro se necessário
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  // Manipular mudanças em checkboxes (múltiplas seleções)
  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    setResponses(prev => {
      const currentSelections = Array.isArray(prev[questionId]) ? [...prev[questionId]] : [];
      
      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentSelections, option]
        };
      } else {
        return {
          ...prev,
          [questionId]: currentSelections.filter(item => item !== option)
        };
      }
    });
    
    // Limpar erro se necessário
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  // Validar e simular envio
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;
    
    // Verificar campos obrigatórios
    const newErrors: Record<string, string> = {};
    
    formData.questions.forEach(question => {
      if (question.required) {
        const response = responses[question.id];
        
        if (response === undefined || response === null || response === "" || 
            (Array.isArray(response) && response.length === 0)) {
          newErrors[question.id] = "Esta pergunta é obrigatória";
        }
      }
    });
    
    // Se houver erros, atualizar estado e parar
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Rolar até o primeiro erro
      const firstErrorId = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }
    
    // Simular envio bem sucedido
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reiniciar formulário
  const resetForm = () => {
    setResponses({});
    setErrors({});
    setIsSubmitted(false);
  };

  // Renderizar diferentes tipos de perguntas
  const renderQuestion = (question: Question, index: number) => {
    const hasError = !!errors[question.id];
    
    return (
      <div 
        key={question.id} 
        id={question.id}
        className={`p-6 bg-white dark:bg-gray-800 rounded-lg border ${
          hasError 
            ? "border-red-300 dark:border-red-700" 
            : "border-gray-200 dark:border-gray-700"
        } mb-4`}
      >
        <div className="flex items-start mb-4">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3 mt-0.5">
            {index + 1}
          </span>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">
              {question.text}
              {question.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </p>
          </div>
        </div>

        {hasError && (
          <div className="mb-4 flex items-center text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 mr-2" />
            <p className="text-sm">{errors[question.id]}</p>
          </div>
        )}

        <div className="mt-2">
          {question.type === "text" && (
            <Input
              value={responses[question.id] || ""}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              placeholder="Digite sua resposta aqui"
              className={hasError ? "border-red-300 dark:border-red-700" : ""}
              disabled={isSubmitted}
            />
          )}

          {question.type === "textarea" && (
            <Textarea
              value={responses[question.id] || ""}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              placeholder="Digite sua resposta aqui"
              rows={4}
              className={hasError ? "border-red-300 dark:border-red-700" : ""}
              disabled={isSubmitted}
            />
          )}

          {question.type === "radio" && question.options && (
            <div className="space-y-2">
              {question.options.map((option, i) => (
                <label key={i} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={responses[question.id] === option}
                    onChange={() => handleResponseChange(question.id, option)}
                    className="rounded-full"
                    disabled={isSubmitted}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === "checkbox" && question.options && (
            <div className="space-y-2">
              {question.options.map((option, i) => {
                const selectedOptions = responses[question.id] || [];
                const isChecked = Array.isArray(selectedOptions) && 
                  selectedOptions.includes(option);
                
                return (
                  <label key={i} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={`${question.id}-${i}`}
                      checked={isChecked}
                      onChange={(e) => handleCheckboxChange(
                        question.id, 
                        option, 
                        e.target.checked
                      )}
                      className="rounded"
                      disabled={isSubmitted}
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          )}

          {question.type === "select" && question.options && (
            <select
              value={responses[question.id] || ""}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              className={`w-full p-2 border rounded-md ${
                hasError 
                  ? "border-red-300 dark:border-red-700" 
                  : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-800`}
              disabled={isSubmitted}
            >
              <option value="">Selecione uma opção</option>
              {question.options.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          {question.type === "scale" && (
            <div className="flex space-x-2 my-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="flex flex-col items-center">
                  <input
                    type="radio"
                    name={question.id}
                    value={value}
                    checked={responses[question.id] === value.toString()}
                    onChange={() => handleResponseChange(question.id, value.toString())}
                    className="sr-only"
                    disabled={isSubmitted}
                  />
                  <span 
                    className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
                      responses[question.id] === value.toString()
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {value}
                  </span>
                  <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                    {value === 1 ? "Ruim" : value === 5 ? "Excelente" : ""}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    );
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

  if (!formData) {
    return (
      <div className="p-6">
        <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Formulário não encontrado</h2>
          <p>O formulário solicitado não existe ou não está disponível.</p>
          <Button 
            onClick={() => router.push("/admin/forms")}
            className="mt-4"
          >
            Voltar para Formulários
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push("/admin/forms")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Formulários
        </Button>
        
        {formData && (
          <Badge 
            variant="outline" 
            className={`${formData.status === 'published' ? 'text-green-500 border-green-500' : 'text-amber-500 border-amber-500'}`}
          >
            {formData.status === 'published' ? 'Publicado' : 'Rascunho'}
          </Badge>
        )}
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
            <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {isLoading ? (
        <div className="p-6 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <p>Carregando formulário...</p>
        </div>
      ) : !formData ? (
        <div className="p-6 flex justify-center items-center">
          <AlertCircle className="h-8 w-8 mr-3 text-red-500" />
          <p className="text-red-500">Formulário não encontrado</p>
        </div>
      ) : (
        <>
          {isSubmitted ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-10">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <CardTitle className="text-2xl mb-2">Obrigado pelo seu feedback!</CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Suas respostas foram enviadas com sucesso.
                  </p>
                  <Button onClick={resetForm}>
                    Enviar Outro Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{formData.title}</CardTitle>
                  {formData.description && (
                    <CardDescription>{formData.description}</CardDescription>
                  )}
                </CardHeader>
              </Card>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6 mb-6">
                  {formData.questions.map((question, index) => (
                    renderQuestion(question, index)
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    * Campo obrigatório
                  </p>
                  <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Enviar Feedback
                  </Button>
                </div>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
} 