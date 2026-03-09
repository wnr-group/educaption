# Group Eligibility Mapping Logic

This document explains how courses are mapped to group codes (SCI-*, ART-*, VOC-*) and the formula logic.

## Group Categories

### Science Groups with Mathematics (P+C+M)
**Groups:** SCI-1, SCI-2, SCI-3, SCI-4, SCI-5, SCI-10
- SCI-1: Physics, Chemistry, Mathematics, Computer Science
- SCI-2: Physics, Chemistry, Mathematics, Communicative English
- SCI-3: Physics, Chemistry, Mathematics, Home Science
- SCI-4: Physics, Chemistry, Mathematics, Statistics
- SCI-5: Physics, Chemistry, Mathematics, Bio-Chemistry
- SCI-10: Physics, Chemistry, Biology, Mathematics

### Science Groups with Biology (P+C+B)
**Groups:** SCI-6, SCI-7, SCI-8, SCI-9, SCI-11, SCI-12, SCI-13
- SCI-6: Physics, Chemistry, Biology, Bio-Chemistry
- SCI-7: Physics, Chemistry, Biology, Computer Science
- SCI-8: Physics, Chemistry, Biology, Communicative English
- SCI-9: Physics, Chemistry, Biology, Home Science
- SCI-11: Physics, Chemistry, Biology, Micro-Biology
- SCI-12: Physics, Chemistry, Biology, General Nursing
- SCI-13: Physics, Chemistry, Biology, Nutrition & Dietetics

### Science Group with Botany+Zoology
**Group:** SCI-14
- SCI-14: Physics, Chemistry, Botany, Zoology

### Vocational Groups with Mathematics
**Groups:** VOC-7, VOC-8, VOC-9, VOC-10, VOC-11, VOC-12
- VOC-7: Mathematics, Basic Automobile Engineering (Theory + Practical)
- VOC-8: Mathematics, Basic Civil Engineering (Theory + Practical)
- VOC-9: Mathematics, Basic Electrical Engineering (Theory + Practical)
- VOC-10: Mathematics, Basic Electronics Engineering (Theory + Practical)
- VOC-11: Mathematics, Basic Mechanical Engineering (Theory + Practical)
- VOC-12: Mathematics, Textile Technology (Theory + Practical)

### Vocational Groups with Biology
**Groups:** VOC-1, VOC-2
- VOC-1: Biology, Agricultural Science (Theory + Practical)
- VOC-2: Biology, Nursing Vocational (Theory + Practical)

### Vocational Groups with Commerce
**Groups:** VOC-3, VOC-4
- VOC-3: Commerce, Office Management (Theory + Practical)
- VOC-4: Commerce, Accountancy & Auditing (Theory + Practical)

### Vocational Groups with Home Science
**Groups:** VOC-5, VOC-6
- VOC-5: Home Science, Food Service Management (Theory + Practical)
- VOC-6: Home Science, Textile and Dress Designing (Theory + Practical)

### Arts Groups
**Groups:** ART-1 through ART-14
- All commerce and humanities combinations

---

## Admission Bodies & Formulas

### 1. TNEA (Engineering)
| Variant | Formula | Eligible Groups |
|---------|---------|-----------------|
| TNEA | Maths + Physics/2 + Chemistry/2 | SCI-1, SCI-2, SCI-3, SCI-4, SCI-5, SCI-10 |
| TNEA - Vocational | Maths + theory/2 + practical/2 | VOC-7, VOC-8, VOC-9, VOC-10, VOC-11, VOC-12 |

### 2. TNDALU (Law)
| Variant | Formula | Eligible Groups |
|---------|---------|-----------------|
| TNDALU | (S3 + S4 + S5 + S6) / 4 | ALL GROUPS |

### 3. TANUVAS (Veterinary)
| Variant | Formula | Eligible Groups |
|---------|---------|-----------------|
| TANUVAS - BVSC | Biology + Physics/2 + Chemistry/2 | SCI-6 to SCI-14 |
| TANUVAS - BVSC - Vocational | Biology + theory/2 + practical/2 | VOC-1 |
| TANUVAS - B.Tech | Biology/2 + Physics/2 + Chemistry/2 + Maths/2 | SCI-6 to SCI-13 (groups with Biology) |

### 4. TNAU (Agriculture)
| Variant | Formula | Eligible Groups | Courses |
|---------|---------|-----------------|---------|
| TNAU - Agriculture | Biology/2 + Physics/2 + Chemistry/2 + LIST_A/2 | SCI-6 to SCI-13 | B.Sc Agri/Horti/Forestry/Seri, B.Tech Biotech/Bioinformatics, B.Sc Agribusiness |
| TNAU - Agriculture - BotZoo | Physics/2 + Chemistry/2 + Botany/2 + Zoology/2 | SCI-14 | Same courses |
| TNAU - Agriculture - Vocational | Biology/2 + computer tech/2 + theory/2 + practical/2 | VOC-1 | B.Sc Agri/Horti/Forestry, B.Tech Agri Eng |
| TNAU - Food Nutrition | Biology/2 + Physics/2 + Chemistry/2 + LIST_B/2 | SCI-6 to SCI-13 | B.Sc Food Nutrition & Dietetics |
| TNAU - Food Nutrition - BotZoo | Physics/2 + Chemistry/2 + Botany/2 + Zoology/2 | SCI-14 | Same course |
| TNAU - Agri Engineering | Biology/2 + Physics/2 + Chemistry/2 + LIST_C/2 | SCI-6 to SCI-13 | B.Tech Agri Eng/Food Tech/Energy/IT |

### 5. TNJFU (Fisheries)
| Variant | Formula | Eligible Groups | Courses |
|---------|---------|-----------------|---------|
| TNJFU - Fisheries | Biology/2 + Physics/2 + Chemistry/2 + LIST_D/2 | SCI-6 to SCI-13 | B.F.Sc |
| TNJFU - Fisheries - BotZoo | Physics/2 + Chemistry/2 + Botany/2 + Zoology/2 | SCI-14 | B.F.Sc |
| TNJFU - Fisheries - Vocational | Biology/2 + computer tech/2 + theory/2 + practical/2 | VOC-1 | B.F.Sc |
| TNJFU - B.Tech | Maths/2 + Physics/2 + Chemistry/2 + LIST_E/2 | SCI-1 to SCI-5, SCI-10 | B.Tech Fisheries Eng/Food Tech/Energy |
| TNJFU - B.Voc | Average of all subject marks | ALL GROUPS | B.Voc courses |

### 6. TN Paramedical
| Variant | Formula | Eligible Groups | Courses |
|---------|---------|-----------------|---------|
| TN Paramedical - Pharmacy | Physics/2 + Chemistry/2 + LIST_F/2 | SCI-6 to SCI-13 | B.Pharm, BASLP, B.Optom |
| TN Paramedical - Pharmacy - BotZoo | Physics/2 + Chemistry/2 + Botany/2 + Zoology/2 | SCI-14 | Same courses |
| TN Paramedical - Nursing | Biology + Physics/2 + Chemistry/2 | SCI-6 to SCI-13 | B.Sc Nursing, BPT, Radiology, etc. (16 courses) |
| TN Paramedical - Nursing - BotZoo | Physics/2 + Chemistry/2 + Botany/2 + Zoology/2 | SCI-14 | Same courses |

**Note:** Vocational stream students are NOT eligible for TN Paramedical courses.

---

## Subject Lists (SUB LIST)

| List | Subjects |
|------|----------|
| LIST_A | Mathematics, Microbiology, Biochemistry, Computer Science, Home Science |
| LIST_B | Mathematics, Microbiology, Biochemistry, Computer Science, Home Science, Nutrition and Dietetics |
| LIST_C | Mathematics, Computer Science |
| LIST_D | Mathematics, Microbiology, Biochemistry, Computer Science, Home Science |
| LIST_E | Biology, Computer Science |
| LIST_F | Biology, Mathematics (Priority: Biology first, Mathematics only if Biology not available) |

---

## Key Rules

1. **SCI-10** (Physics, Chemistry, Biology, Mathematics) is eligible for BOTH Engineering and Biology-based courses.

2. **BotZoo formula** (Physics/2 + Chemistry/2 + Botany/2 + Zoology/2) is ONLY for SCI-14.

3. **Vocational formulas** use theory/practical subjects instead of standard academic subjects.

4. **Paramedical courses** do NOT accept vocational stream students.

5. **Law courses (TNDALU)** accept ALL groups - formula uses average of subjects 3-6.

6. **B.Voc courses** accept ALL groups - formula uses average of all subjects.
