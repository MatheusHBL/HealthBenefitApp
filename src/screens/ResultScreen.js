import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ResultScreen = ({ route, navigation }) => {
  const { formData } = route.params;
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const checkEligibility = () => {
    const idade = parseInt(formData.idade);
    const mesesAtivo = parseInt(formData.mesesAtivo);
    const dependentes = parseInt(formData.dependentes);
    
    // Regra 1: Idade entre 18 e 65 anos
    if (idade < 18 || idade > 65) {
      return {
        eligible: false,
        message: "Desculpe, você não pode receber o benefício porque a idade deve estar entre 18 e 65 anos."
      };
    }

    // Regra 2: Plano Premium ou (plano Essencial e ativo há pelo menos 12 meses)
    if (formData.tipoPlano !== 'Premium' && 
        !(formData.tipoPlano === 'Essencial' && mesesAtivo >= 12)) {
      if (formData.tipoPlano === 'Básico') {
        return {
          eligible: false,
          message: "Desculpe, você não pode receber o benefício porque o plano Básico não está qualificado para este benefício."
        };
      } else if (formData.tipoPlano === 'Essencial' && mesesAtivo < 12) {
        return {
          eligible: false,
          message: "Desculpe, você não pode receber o benefício porque o plano Essencial precisa estar ativo há pelo menos 12 meses."
        };
      }
    }

    // Regra 3: Carência concluída
    if (formData.carenciaConcluida !== 'sim') {
      return {
        eligible: false,
        message: "Desculpe, você não pode receber o benefício porque ainda não concluiu o período de carência."
      };
    }

    // Regra 4: Não ter doenças crônicas cadastradas
    if (formData.doencasCronicas === 'sim') {
      return {
        eligible: false,
        message: "Desculpe, você não pode receber o benefício porque possui doenças crônicas cadastradas."
      };
    }

    // Regra 5: Ter no máximo 3 dependentes
    if (dependentes > 3) {
      return {
        eligible: false,
        message: "Desculpe, você não pode receber o benefício porque possui mais de 3 dependentes."
      };
    }

    // Regra 6: Ter consultas liberadas nos últimos 6 meses
    if (formData.consultasLiberadas !== 'sim') {
      return {
        eligible: false,
        message: "Desculpe, você não pode receber o benefício porque não teve consultas liberadas nos últimos 6 meses."
      };
    }

    // Regra 7: Não haver faturas em atraso
    if (formData.faturaAtraso === 'sim') {
      return {
        eligible: false,
        message: "Desculpe, você não pode receber o benefício porque existe fatura em atraso."
      };
    }

    // Regra 8: Morar em SP, MG ou PR
    if (!['SP', 'MG', 'PR'].includes(formData.estado)) {
      return {
        eligible: false,
        message: "Desculpe, você não pode receber o benefício porque este benefício está disponível apenas para São Paulo, Minas Gerais e Paraná."
      };
    }

    // Se chegou até aqui, está elegível
    return {
      eligible: true,
      message: "Parabéns, você está qualificado para o benefício extra do seu Plano de Saúde!"
    };
  };

  const result = checkEligibility();

  const getStateFullName = (state) => {
    const states = {
      'SP': 'São Paulo',
      'MG': 'Minas Gerais',
      'PR': 'Paraná',
      'OUTROS': 'Outros estados'
    };
    return states[state] || state;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View 
          style={[
            styles.resultContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={result.eligible ? ['#10b981', '#059669'] : ['#ef4444', '#dc2626']}
            style={styles.resultCard}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.resultIcon}>
                {result.eligible ? '✅' : '❌'}
              </Text>
            </View>
            
            <Text style={styles.resultTitle}>
              {result.eligible ? 'Qualificado!' : 'Não Qualificado'}
            </Text>
            
            <Text style={styles.resultMessage}>
              {result.message}
            </Text>
          </LinearGradient>
        </Animated.View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo das Informações</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Idade:</Text>
            <Text style={styles.summaryValue}>{formData.idade} anos</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Tipo de Plano:</Text>
            <Text style={styles.summaryValue}>{formData.tipoPlano}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Meses Ativo:</Text>
            <Text style={styles.summaryValue}>{formData.mesesAtivo} meses</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Carência Concluída:</Text>
            <Text style={styles.summaryValue}>
              {formData.carenciaConcluida === 'sim' ? 'Sim' : 'Não'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Doenças Crônicas:</Text>
            <Text style={styles.summaryValue}>
              {formData.doencasCronicas === 'sim' ? 'Sim' : 'Não'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Dependentes:</Text>
            <Text style={styles.summaryValue}>{formData.dependentes}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Consultas nos últimos 6 meses:</Text>
            <Text style={styles.summaryValue}>
              {formData.consultasLiberadas === 'sim' ? 'Sim' : 'Não'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Fatura em Atraso:</Text>
            <Text style={styles.summaryValue}>
              {formData.faturaAtraso === 'sim' ? 'Sim' : 'Não'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Estado:</Text>
            <Text style={styles.summaryValue}>{getStateFullName(formData.estado)}</Text>
          </View>
        </View>

        {result.eligible && (
          <View style={styles.nextStepsCard}>
            <Text style={styles.nextStepsTitle}>🎉 Próximos Passos</Text>
            <Text style={styles.nextStepsText}>
              • Entre em contato com nossa central de atendimento{'\n'}
              • Tenha em mãos seu número de carteirinha{'\n'}
              • O benefício será ativado em até 48 horas{'\n'}
              • Você receberá uma confirmação por SMS
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.newVerificationButton}
            onPress={() => navigation.navigate('Form')}
          >
            <Text style={styles.newVerificationButtonText}>Nova Verificação</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.homeButtonText}>Voltar ao Início</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  resultContainer: {
    marginBottom: 24,
  },
  resultCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 16,
  },
  resultIcon: {
    fontSize: 64,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  resultMessage: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.95,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'right',
    flex: 1,
  },
  nextStepsCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 12,
  },
  nextStepsText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  newVerificationButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newVerificationButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  homeButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
});

export default ResultScreen;