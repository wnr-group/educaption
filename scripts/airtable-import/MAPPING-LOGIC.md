# Group Eligibility Mapping Logic

This document explains how courses were mapped to the new group codes (SCI-*, ART-*, VOC-*).

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
- VOC-7: Mathematics, Basic Automobile Engineering
- VOC-8: Mathematics, Basic Civil Engineering
- VOC-9: Mathematics, Basic Electrical Engineering
- VOC-10: Mathematics, Basic Electronics Engineering
- VOC-11: Mathematics, Basic Mechanical Engineering
- VOC-12: Mathematics, Textile Technology

### Vocational Groups with Biology
**Groups:** VOC-1, VOC-2
- VOC-1: Biology, Agricultural Science
- VOC-2: Biology, Nursing (Vocational)

### Vocational Groups with Commerce
**Groups:** VOC-3, VOC-4
- VOC-3: Commerce, Office Management
- VOC-4: Commerce, Accountancy & Auditing

### Vocational Groups with Home Science
**Groups:** VOC-5, VOC-6
- VOC-5: Home Science, Food Service Management
- VOC-6: Home Science, Textile and Dress Designing

### Arts Groups
**Groups:** ART-1 through ART-14
- All commerce and humanities combinations

## Course Type Mappings

### Engineering Courses (TNEA)
**Formula:** M + P/2 + C/2
**Eligible Groups:** All Science groups with Mathematics + All Vocational groups with Mathematics
- SCI-1, SCI-2, SCI-3, SCI-4, SCI-5, SCI-10, VOC-7, VOC-8, VOC-9, VOC-10, VOC-11, VOC-12

### Medical/Veterinary Courses (TANUVAS - BVSC)
**Formula:** B + P/2 + C/2
**Eligible Groups:** All Science groups with Biology + Biology vocational groups
- SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, SCI-14, VOC-1

### Paramedical Courses - Biology Stream
**Formula:** B + P/2 + C/2
**Eligible Groups:** All Science groups with Biology (excluding SCI-14) + Biology vocational groups
- SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, VOC-1, VOC-2

### Paramedical Courses - BotZoo Stream
**Formula:** B + P/2 + C/2
**Eligible Groups:** Only SCI-14
- SCI-14

### Paramedical Courses - Mathematics Stream
**Formula:** M + P/2 + C/2
**Eligible Groups:** All Science groups with Mathematics + All Vocational groups with Mathematics
- SCI-1, SCI-2, SCI-3, SCI-4, SCI-5, SCI-10, VOC-7, VOC-8, VOC-9, VOC-10, VOC-11, VOC-12

### Agriculture/Fisheries Courses (TNAU, TNJFU)
**Formula:** Various with LIST_X placeholders
**Eligible Groups:** Combined Mathematics and Biology groups + relevant vocational groups
- SCI-1, SCI-2, SCI-3, SCI-4, SCI-5, SCI-6, SCI-7, SCI-8, SCI-9, SCI-10, SCI-11, SCI-12, SCI-13, VOC-1, VOC-7, VOC-8, VOC-9, VOC-10, VOC-11, VOC-12

### Law Courses (TNDALU)
**Formula:** (S3 + S4 + S5 + S6) / 4
**Eligible Groups:** ALL GROUPS (40 groups)
- All SCI-*, ART-*, VOC-* groups

### B.Voc Courses
**Formula:** AVG (average of all subjects)
**Eligible Groups:** ALL GROUPS (40 groups)
- All SCI-*, ART-*, VOC-* groups

## Notes

1. **SCI-10** (Physics, Chemistry, Biology, Mathematics) is eligible for BOTH Engineering and Medical courses because it contains both Mathematics AND Biology.

2. **BotZoo courses** only accept SCI-14 (Botany+Zoology group) as this is the traditional biology group structure.

3. **Vocational groups** are now properly integrated:
   - VOC-7 to VOC-12 (Engineering vocational) can apply for Engineering courses
   - VOC-1 to VOC-2 (Biology vocational) can apply for Biology-based courses
   - VOC-3 to VOC-4 (Commerce vocational) can apply for Commerce courses
   - All VOC groups can apply for Law and B.Voc courses

4. **Arts groups (ART-1 to ART-14)** are primarily for Law and B.Voc courses in the current dataset. Additional arts courses can be added later.
