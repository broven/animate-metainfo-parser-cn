import { animateFilter, AnimateTitleMetaParser, IResolution } from '../src';
import fs from 'fs';
// https://mikanani.me/
describe('api testing', () => {
  describe('幻樱字幕组', () => {
    test('合集', () => {
      const content = fs.readFileSync('test/data/collection.rss');
      const result = animateFilter(content.toString());
      expect(result).toMatchSnapshot();
    });
    test('语言过滤', () => {
      const content = fs.readFileSync('test/data/language.rss');
      const result = animateFilter(content.toString());
      expect(result).toMatchSnapshot();
    });
    test('单集多分辨率', () => {
      const content = fs.readFileSync('test/data/uni.rss');
      const result = animateFilter(content.toString());
      expect(result).toMatchSnapshot();
    });
  });
  describe('桜都字幕组', () => {
    test('case1', () => {
      const content = fs.readFileSync('test/data/realworld/2581.rss');
      const result = animateFilter(content.toString());
      expect(result).toMatchSnapshot();
    });
  });
});

describe('metaparser testing', () => {
  describe.each([
    [
      '【动漫国字幕组】★07月新番[碧水白沙 / 白沙的水族馆][11-14][1080P][繁体][MP4]',
      IResolution.r1080p,
      false,
      false,
      -1,
      -1,
    ], // 这种的集数简直毒瘤
    [
      '[喵萌奶茶屋&LoliHouse] 平家物语 / Heike Monogatari - 03 [WebRip 1080p HEVC-10bit AAC][简繁日内封字幕]',
      IResolution.r1080p,
      false,
      true,
      -1,
      3,
    ],
    [
      '【喵萌Production】★07月新番★[Love Live! Superstar!! / ラブライブ！スーパースター!!][11][1080p][繁日双语][招募翻译]',
      IResolution.r1080p,
      false,
      false,
      -1,
      11,
    ],
    [
      '[桜都字幕组] 180秒能让你的耳朵幸福吗？ / 180 Byou de Kimi no Mimi o Shiawase ni Dekiru ka？ [02][720p][繁体内嵌]',
      IResolution.r720p,
      false,
      false,
      -1,
      2,
    ],
    [
      '【动漫国字幕组】★07月新番[摇曳庄的幽奈小姐 / 汤摇庄的幽奈同学][12 END][720P][简体][MP4]',
      IResolution.r720p,
      false,
      true,
      -1,
      12,
    ],
    [
      '小明和王猫：第10话 劳菲尔行动.mp4',
      IResolution.rUnknown,
      false,
      true,
      -1,
      10
    ]
  ])(
    'AnimateTitleMetaParser %s',
    (title, resolution, isSeasonPack, isChinese, season, ep) => {
      const metaParser = new AnimateTitleMetaParser(title);
      test('分辨率', () => {
        expect(metaParser.resolution).toBe(resolution);
      });
      test('是否是合集', () => {
        expect(metaParser.isSeasonPack).toBe(isSeasonPack);
      });
      test('中文识别', () => {
        expect(metaParser.isTraditionalChinese).toEqual(!isChinese);
      });
      test('season', () => {
        expect(metaParser.season).toBe(season);
      });
      test('episode', () => {
        expect(metaParser.episode).toBe(ep);
      });
    }
  );
});
