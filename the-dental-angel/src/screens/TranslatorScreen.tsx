import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import type { TranslatorScreenProps } from '../types/navigation';

// Categories for filtering
type CategoryType = 'all' | 'procedures' | 'conditions' | 'diagnostics';

interface GlossaryEntry {
  plain: string;
  details: string;
  category: CategoryType;
}

// Common dental terms glossary with categories
const DENTAL_GLOSSARY: { [key: string]: GlossaryEntry } = {
  crown: {
    plain: 'A protective cap that covers your entire tooth',
    details:
      "Think of it like a helmet for a weakened or damaged tooth. It restores the tooth's shape, size, and strength.",
    category: 'procedures',
  },
  'root canal': {
    plain: 'Cleaning out infection from inside your tooth',
    details:
      'The soft tissue (pulp) inside your tooth gets removed if infected, but the tooth stays in place. Modern root canals are usually no worse than getting a filling!',
    category: 'procedures',
  },
  filling: {
    plain: 'Patching a hole (cavity) in your tooth',
    details:
      "Your dentist removes the decayed part and fills the space with material to restore your tooth's shape.",
    category: 'procedures',
  },
  extraction: {
    plain: 'Removing a tooth completely',
    details:
      'Sometimes a tooth is too damaged to save, or needs to come out for other reasons (like wisdom teeth).',
    category: 'procedures',
  },
  implant: {
    plain: 'An artificial tooth root with a replacement tooth on top',
    details:
      'A titanium post is placed in your jawbone, then a crown is attached. It looks and functions like a natural tooth.',
    category: 'procedures',
  },
  bridge: {
    plain: 'A false tooth held in place by teeth on either side',
    details:
      "If you're missing a tooth, a bridge uses the neighboring teeth as anchors to hold a replacement tooth in the gap.",
    category: 'procedures',
  },
  veneer: {
    plain: 'A thin shell that covers the front of your tooth',
    details:
      'Usually made of porcelain, veneers improve the appearance of teeth that are stained, chipped, or slightly misaligned.',
    category: 'procedures',
  },
  scaling: {
    plain: 'Deep cleaning below your gum line',
    details:
      'Removes tartar (hardened plaque) from tooth roots. Often combined with "root planing" to smooth the roots.',
    category: 'procedures',
  },
  prophylaxis: {
    plain: 'A routine dental cleaning',
    details: 'The professional cleaning you get at regular checkups to remove plaque and tartar.',
    category: 'procedures',
  },
  onlay: {
    plain: 'A partial crown that covers part of your tooth',
    details:
      'More conservative than a full crown - only covers the damaged portion. Preserves more natural tooth.',
    category: 'procedures',
  },
  inlay: {
    plain: 'A filling made in a lab that fits inside your tooth',
    details:
      'Like a puzzle piece that fits perfectly into a cavity. More precise than a regular filling.',
    category: 'procedures',
  },
  gingivitis: {
    plain: 'Early-stage gum disease',
    details:
      'Gums are red, swollen, and may bleed easily. Reversible with good brushing and flossing!',
    category: 'conditions',
  },
  periodontitis: {
    plain: 'Advanced gum disease',
    details:
      'Gums pull away from teeth, bone loss can occur. Needs professional treatment to manage.',
    category: 'conditions',
  },
  periodontal: {
    plain: 'Related to your gums and the bone supporting your teeth',
    details: 'Periodontal disease (gum disease) affects the tissues that hold your teeth in place.',
    category: 'conditions',
  },
  abscess: {
    plain: 'A pocket of infection (pus)',
    details:
      'Usually very painful. Can form at the root of a tooth or in the gums. Needs treatment promptly.',
    category: 'conditions',
  },
  caries: {
    plain: 'Cavities / tooth decay',
    details: 'The medical term for what happens when bacteria break down your tooth structure.',
    category: 'conditions',
  },
  bruxism: {
    plain: 'Grinding or clenching your teeth',
    details:
      'Often happens during sleep. Can wear down teeth and cause jaw pain. A night guard can help.',
    category: 'conditions',
  },
  tmj: {
    plain: 'Jaw joint problems',
    details:
      'TMJ stands for temporomandibular joint - the hinge connecting your jaw to your skull. Can cause pain, clicking, or difficulty opening your mouth.',
    category: 'conditions',
  },
  malocclusion: {
    plain: "Teeth that don't line up correctly",
    details:
      'Common examples include overbite, underbite, or crowded teeth. Often treated with braces or aligners.',
    category: 'conditions',
  },
  occlusion: {
    plain: 'How your teeth come together when you bite',
    details:
      'Your "bite" - if teeth don\'t align properly, it can cause problems with chewing or jaw pain.',
    category: 'conditions',
  },
  pulp: {
    plain: 'The soft tissue inside your tooth',
    details:
      'Contains nerves and blood vessels. When this gets infected, you may need a root canal.',
    category: 'conditions',
  },
  calculus: {
    plain: 'Hardened plaque (tartar)',
    details:
      "When plaque isn't removed, it hardens into calculus. Can only be removed by a dental professional.",
    category: 'conditions',
  },
  bitewing: {
    plain: 'X-ray that shows your back teeth',
    details: 'You bite down on a tab while the X-ray is taken. Helps find cavities between teeth.',
    category: 'diagnostics',
  },
  panoramic: {
    plain: 'X-ray that shows your entire mouth in one image',
    details:
      'The machine rotates around your head. Shows all teeth, jawbones, and surrounding structures.',
    category: 'diagnostics',
  },
  periapical: {
    plain: 'X-ray that shows the entire tooth from crown to root',
    details: 'Shows the whole tooth and surrounding bone. Used to find problems at the root tip.',
    category: 'diagnostics',
  },
  amalgam: {
    plain: 'Silver-colored filling material',
    details:
      "A durable mixture of metals that's been used for fillings for over 150 years. Very strong for back teeth.",
    category: 'procedures',
  },
  composite: {
    plain: 'Tooth-colored filling material',
    details: 'A resin that can be matched to your tooth color. Popular for visible areas.',
    category: 'procedures',
  },
};

// Category display names
const CATEGORY_NAMES: { [key in CategoryType]: string } = {
  all: 'All Terms',
  procedures: 'Procedures',
  conditions: 'Conditions',
  diagnostics: 'X-rays & Diagnostics',
};

export function TranslatorScreen({ navigation }: TranslatorScreenProps) {
  const [searchText, setSearchText] = React.useState('');
  const [selectedTerm, setSelectedTerm] = React.useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryType | null>(null);

  // Filter glossary based on search and category
  const filteredTerms = React.useMemo(() => {
    let terms = Object.keys(DENTAL_GLOSSARY);

    // Filter by category if selected
    if (selectedCategory && selectedCategory !== 'all') {
      terms = terms.filter((term) => DENTAL_GLOSSARY[term].category === selectedCategory);
    }

    // Filter by search text
    if (searchText.trim()) {
      const search = searchText.toLowerCase().trim();
      terms = terms.filter((term) => term.toLowerCase().includes(search));
    }

    return terms.sort();
  }, [searchText, selectedCategory]);

  const hasResults = filteredTerms.length > 0;

  const handleTermPress = (term: string) => {
    setSelectedTerm(term);
  };

  const handleAskAngel = () => {
    // Navigate to chat with the term as a question
    navigation.navigate('Home', {
      screen: 'Chat',
      params: {
        initialMessage: `Can you explain what "${searchText}" means in dental terms? Please explain it in simple, plain English.`,
      },
    });
  };

  const clearSearch = () => {
    setSearchText('');
    setSelectedTerm(null);
  };

  const handleCategoryPress = (category: CategoryType) => {
    setSelectedCategory(category);
    setSelectedTerm(null);
    setSearchText('');
  };

  const clearCategory = () => {
    setSelectedCategory(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.neutral400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Type a dental term..."
            placeholderTextColor={COLORS.neutral400}
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              setSelectedTerm(null);
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color={COLORS.neutral400} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Selected Term Detail */}
        {selectedTerm && DENTAL_GLOSSARY[selectedTerm] && (
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTerm}>{selectedTerm}</Text>
              <TouchableOpacity onPress={() => setSelectedTerm(null)}>
                <Ionicons name="close" size={24} color={COLORS.neutral500} />
              </TouchableOpacity>
            </View>

            <View style={styles.plainEnglishBox}>
              <Text style={styles.plainEnglishLabel}>In Plain English:</Text>
              <Text style={styles.plainEnglishText}>{DENTAL_GLOSSARY[selectedTerm].plain}</Text>
            </View>

            <Text style={styles.detailsText}>{DENTAL_GLOSSARY[selectedTerm].details}</Text>

            <TouchableOpacity
              style={styles.askMoreButton}
              onPress={() => {
                navigation.navigate('Home', {
                  screen: 'Chat',
                  params: {
                    initialMessage: `Tell me more about ${selectedTerm}. What should I know and what questions should I ask my dentist?`,
                  },
                });
              }}
            >
              <Ionicons name="chatbubbles" size={18} color={COLORS.white} />
              <Text style={styles.askMoreText}>Ask Dr. Angel for more details</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* No Results - Ask Dr. Angel */}
        {searchText.trim() && !hasResults && !selectedTerm && (
          <View style={styles.noResultsCard}>
            <Ionicons name="help-circle-outline" size={48} color={COLORS.primary500} />
            <Text style={styles.noResultsTitle}>Term not in glossary</Text>
            <Text style={styles.noResultsText}>
              "{searchText}" isn't in my quick reference, but Dr. Angel can explain it for you!
            </Text>
            <TouchableOpacity style={styles.askAngelButton} onPress={handleAskAngel}>
              <Ionicons name="chatbubbles" size={20} color={COLORS.white} />
              <Text style={styles.askAngelText}>Ask Dr. Angel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Glossary List */}
        {!selectedTerm && hasResults && (
          <>
            <Text style={styles.sectionTitle}>
              {searchText.trim()
                ? `Results for "${searchText}"`
                : selectedCategory
                  ? CATEGORY_NAMES[selectedCategory]
                  : 'Common Dental Terms'}
            </Text>
            <Text style={styles.sectionSubtitle}>Tap any term to see it in plain English</Text>

            <View style={styles.termsGrid}>
              {filteredTerms.map((term) => (
                <TouchableOpacity
                  key={term}
                  style={styles.termChip}
                  onPress={() => handleTermPress(term)}
                >
                  <Text style={styles.termChipText}>{term}</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.primary500} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Category Header (when category is selected) */}
        {selectedCategory && !selectedTerm && (
          <View style={styles.categoryHeader}>
            <TouchableOpacity onPress={clearCategory} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color={COLORS.primary500} />
              <Text style={styles.backText}>All Categories</Text>
            </TouchableOpacity>
            <Text style={styles.categoryHeaderTitle}>{CATEGORY_NAMES[selectedCategory]}</Text>
          </View>
        )}

        {/* Quick Categories */}
        {!searchText.trim() && !selectedTerm && !selectedCategory && (
          <View style={styles.categoriesSection}>
            <Text style={styles.categoriesTitle}>Browse by Category</Text>

            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('procedures')}
            >
              <View style={[styles.categoryIcon, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="medical" size={24} color="#DC2626" />
              </View>
              <View style={styles.categoryContent}>
                <Text style={styles.categoryName}>Procedures</Text>
                <Text style={styles.categoryCount}>Crown, Root Canal, Filling...</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.neutral400} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('conditions')}
            >
              <View style={[styles.categoryIcon, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="pulse" size={24} color="#16A34A" />
              </View>
              <View style={styles.categoryContent}>
                <Text style={styles.categoryName}>Conditions</Text>
                <Text style={styles.categoryCount}>Gingivitis, Abscess, Caries...</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.neutral400} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => handleCategoryPress('diagnostics')}
            >
              <View style={[styles.categoryIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="scan" size={24} color="#D97706" />
              </View>
              <View style={styles.categoryContent}>
                <Text style={styles.categoryName}>X-rays & Diagnostics</Text>
                <Text style={styles.categoryCount}>Bitewing, Panoramic...</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.neutral400} />
            </TouchableOpacity>
          </View>
        )}

        {/* Tip */}
        <View style={styles.tipBox}>
          <Ionicons name="bulb" size={20} color={COLORS.primary500} />
          <Text style={styles.tipText}>
            Tip: If you have a treatment plan, take a photo and Dr. Angel will translate ALL the
            terms for you!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral50,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.neutral200,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.neutral100,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral800,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    marginBottom: 16,
  },
  termsGrid: {
    gap: 8,
  },
  termChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  termChipText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: COLORS.neutral700,
    textTransform: 'capitalize',
  },
  detailCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailTerm: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: COLORS.primary700,
    textTransform: 'capitalize',
  },
  plainEnglishBox: {
    backgroundColor: COLORS.successLight,
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.success,
  },
  plainEnglishLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.success,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  plainEnglishText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
    lineHeight: 26,
  },
  detailsText: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral600,
    lineHeight: 24,
    marginBottom: 16,
  },
  askMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary500,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  askMoreText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.white,
  },
  noResultsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  noResultsTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral700,
    marginTop: 12,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  askAngelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary500,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 8,
  },
  askAngelText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.white,
  },
  categoriesSection: {
    marginTop: 24,
  },
  categoriesTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral700,
    marginBottom: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  categoryContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.neutral800,
  },
  categoryCount: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.neutral500,
    marginTop: 2,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primary50,
    padding: 14,
    borderRadius: 10,
    marginTop: 24,
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.primary700,
    lineHeight: 20,
  },
  categoryHeader: {
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  backText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.primary500,
  },
  categoryHeaderTitle: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: COLORS.neutral800,
  },
});

export default TranslatorScreen;
