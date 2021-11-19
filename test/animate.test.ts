// Copyright (C) 2021 metajs
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { animateFilter, AnimateTitleMetaParser, IResolution } from '../src';
import fs from 'fs';
// https://mikanani.me/
describe('幻樱字幕组', () => {
    // test('幻樱字幕组', () => {
    //     const content = fs.readFileSync('test/data/幻樱字幕组.rss');
    //     const result = animateFilter(content.toString());
    //     expect(result).toMatchSnapshot();
    // });
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

})
describe.each([
    ['【动漫国字幕组】★07月新番[碧水白沙 / 白沙的水族馆][11-14][1080P][繁体][MP4]', IResolution.r1080p, false, false, -1, -1], // 这种的集数简直毒瘤
    ['[喵萌奶茶屋&LoliHouse] 平家物语 / Heike Monogatari - 03 [WebRip 1080p HEVC-10bit AAC][简繁日内封字幕]', IResolution.r1080p, false, false, -1, 3],
    ['【喵萌Production】★07月新番★[Love Live! Superstar!! / ラブライブ！スーパースター!!][11][1080p][繁日双语][招募翻译]', IResolution.r1080p, false, false, -1, 11],
])('AnimateTitleMetaParser %s', (title, resolution, isSeasonPack, isChinese, season, ep) => {
    const metaParser = new AnimateTitleMetaParser(title);
    test('分辨率', () => {
        expect(metaParser.resolution).toBe(resolution);
    })
    test('是否是合集', () => {
        expect(metaParser.isSeasonPack).toBe(isSeasonPack);
    })
    test('中文识别', () => {
          expect(metaParser.isTraditionalChinese).toEqual(isChinese)
    })
    test('season', () => {
        expect(metaParser.season).toBe(season);
    });
    test('episode', () => {
        expect(metaParser.episode).toBe(ep);
    })

})