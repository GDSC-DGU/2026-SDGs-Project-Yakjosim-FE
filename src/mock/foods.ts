import type { FoodItem } from '@/types';

export const foods: FoodItem[] = [
  {
    id: 'food-001',
    name: '자몽',
    group: '자몽류',
    aliases: ['자몽주스', '그레이프프루트'],
  },
  {
    id: 'food-002',
    name: '커피',
    group: '카페인',
    aliases: ['아메리카노', '에스프레소', '카페인'],
  },
  {
    id: 'food-003',
    name: '녹차',
    group: '카페인',
    aliases: ['그린티'],
  },
  {
    id: 'food-004',
    name: '우유',
    group: '유제품',
    aliases: ['요거트', '치즈', '유제품'],
  },
  {
    id: 'food-005',
    name: '알코올',
    group: '알코올',
    aliases: ['맥주', '소주', '와인', '술'],
  },
  {
    id: 'food-006',
    name: '바나나',
    group: '고칼륨',
    aliases: [],
  },
  {
    id: 'food-007',
    name: '시금치',
    group: '비타민K 함유',
    aliases: ['브로콜리', '케일'],
  },
  {
    id: 'food-008',
    name: '콩',
    group: '콩류',
    aliases: ['두부', '된장', '두유'],
  },
];
