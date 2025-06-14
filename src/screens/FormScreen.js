import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const FormScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    idade: '',
    tipoPlano: '',
    mesesAtivo: '',
    carenciaConcluida: '',
    doencasCronicas: '',
    dependentes: '',
    consultasLiberadas: '',
    faturaAtraso: '',
    estado: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const estados = [
    { label: 'Selecione seu estado', value: '' },
    { label: 'São Paulo', value: 'SP' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Paraná', value: 'PR' },
    { label: 'Outros estados', value: 'OUTROS' },
  ];

  const tiposPlano = [
    { label: 'Selecione o tipo de plano', value: '' },
    { label: 'Básico', value: 'Básico' },
    { label: 'Essencial', value: 'Essencial' },
    { label: 'Premium', value: 'Premium' },
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step) => {
    if (step === 1) {
      return formData.idade && formData.tipoPlano && formData.mesesAtivo;
    }
    if (step === 2) {
      return formData.carenciaConcluida && formData.doencasCronicas && formData.dependentes;
    }
    if (step === 3) {
      return formData.consultasLiberadas && formData.faturaAtraso && formData.estado;
    }
    return false;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    navigation.navigate('Result', { formData });
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${(currentStep / totalSteps) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>
        Etapa {currentStep} de {totalSteps}
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Informações Básicas</Text>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Idade *</Text>
        <TextInput
          style={styles.input}
          value={formData.idade}
          onChangeText={(value) => updateFormData('idade', value)}
          placeholder="Digite sua idade"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Tipo de Plano *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.tipoPlano}
            onValueChange={(value) => updateFormData('tipoPlano', value)}
            style={styles.picker}
          >
            {tiposPlano.map((tipo, index) => (
              <Picker.Item key={index} label={tipo.label} value={tipo.value} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Meses que o plano está ativo *</Text>
        <TextInput
          style={styles.input}
          value={formData.mesesAtivo}
          onChangeText={(value) => updateFormData('mesesAtivo', value)}
          placeholder="Digite a quantidade de meses"
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Situação do Plano</Text>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Período de carência concluído? *</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              formData.carenciaConcluida === 'sim' && styles.optionButtonActive
            ]}
            onPress={() => updateFormData('carenciaConcluida', 'sim')}
          >
            <Text style={[
              styles.optionText,
              formData.carenciaConcluida === 'sim' && styles.optionTextActive
            ]}>Sim</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              formData.carenciaConcluida === 'não' && styles.optionButtonActive
            ]}
            onPress={() => updateFormData('carenciaConcluida', 'não')}
          >
            <Text style={[
              styles.optionText,
              formData.carenciaConcluida === 'não' && styles.optionTextActive
            ]}>Não</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Possui doenças crônicas cadastradas? *</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              formData.doencasCronicas === 'sim' && styles.optionButtonActive
            ]}
            onPress={() => updateFormData('doencasCronicas', 'sim')}
          >
            <Text style={[
              styles.optionText,
              formData.doencasCronicas === 'sim' && styles.optionTextActive
            ]}>Sim</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              formData.doencasCronicas === 'não' && styles.optionButtonActive
            ]}
            onPress={() => updateFormData('doencasCronicas', 'não')}
          >
            <Text style={[
              styles.optionText,
              formData.doencasCronicas === 'não' && styles.optionTextActive
            ]}>Não</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Quantos dependentes estão incluídos? *</Text>
        <TextInput
          style={styles.input}
          value={formData.dependentes}
          onChangeText={(value) => updateFormData('dependentes', value)}
          placeholder="Digite o número de dependentes"
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Situação Atual</Text>
      
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Teve consultas liberadas nos últimos 6 meses? *</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              formData.consultasLiberadas === 'sim' && styles.optionButtonActive
            ]}
            onPress={() => updateFormData('consultasLiberadas', 'sim')}
          >
            <Text style={[
              styles.optionText,
              formData.consultasLiberadas === 'sim' && styles.optionTextActive
            ]}>Sim</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              formData.consultasLiberadas === 'não' && styles.optionButtonActive
            ]}
            onPress={() => updateFormData('consultasLiberadas', 'não')}
          >
            <Text style={[
              styles.optionText,
              formData.consultasLiberadas === 'não' && styles.optionTextActive
            ]}>Não</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Existe alguma fatura em atraso? *</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              formData.faturaAtraso === 'sim' && styles.optionButtonActive
            ]}
            onPress={() => updateFormData('faturaAtraso', 'sim')}
          >
            <Text style={[
              styles.optionText,
              formData.faturaAtraso === 'sim' && styles.optionTextActive
            ]}>Sim</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.optionButton,
              formData.faturaAtraso === 'não' && styles.optionButtonActive
            ]}
            onPress={() => updateFormData('faturaAtraso', 'não')}
          >
            <Text style={[
              styles.optionText,
              formData.faturaAtraso === 'não' && styles.optionTextActive
            ]}>Não</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Estado onde mora *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.estado}
            onValueChange={(value) => updateFormData('estado', value)}
            style={styles.picker}
          >
            {estados.map((estado, index) => (
              <Picker.Item key={index} label={estado.label} value={estado.value} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderProgressBar()}
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.nextButton, currentStep === 1 && styles.nextButtonFull]} 
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? 'Verificar' : 'Próximo'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 24,
    textAlign: 'center',
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  optionButtonActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  optionText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2563eb',
    backgroundColor: '#fff',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  nextButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#2563eb',
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default FormScreen;