
import convert from 'xml-js';

export enum IResolution {
  rUHD = 'UHD',
  r1080p = '1080p',
  r720p = '720p',
  rUnknown = 'unknown'
}
export  const IResolutionPriority = {
  [IResolution.r1080p]: 10,
  [IResolution.r720p]: 5,
  [IResolution.rUHD]: 4,
  [IResolution.rUnknown]: 1
}
export class AnimateTitleMetaParser {
  private rawTitle: string;
  constructor(title: string) {
    this.rawTitle = title;
  }
  get resolution(): IResolution {
    const t = this.rawTitle;
    switch(true) {
      case t.indexOf('1080p') !== -1:
      case t.indexOf('1080P') !== -1:
      case t.indexOf('1920X1080') !== -1:
        return IResolution.r1080p;
      case t.indexOf('720p') !== -1:
      case t.indexOf('1280X720') !== -1:
        return IResolution.r720p;
      default:
        return IResolution.rUnknown;
    }
  }
  get isSeasonPack(): boolean {
    const title = this.rawTitle
    switch(true) {
        case title.indexOf('【合集】') !== -1:
            return true;
        default:
            return false;
    }
  }
  get isTraditionalChinese(): boolean {
    const text = this.rawTitle;
    switch(true) {
        case text.indexOf('BIG5') !== -1:
        case text.indexOf('CHT') !== -1:
            return true;
        default:
            return false;
    }
  }
  get season(): number {
    return -1;
  }
  get episode(): number {
    const splitterArr = [
      /】/, /【/, /\[/, /\]/, /\s/
    ];
    const regArr = [
      /~~~(\d{1,})~~~/
    ];
    let title = this.rawTitle;
    for (const splitter of splitterArr) {
      const _reg = new RegExp(splitter, 'g');
      title = title.replace(_reg, '~~~');
    }
    for (const reg of regArr) {
      const match = reg.exec(title);
      if (match) {
        return parseInt(match[1]);
      }
    }
    return -1;
  }
  get videoId(): string {
    return `S${this.season}-E${this.episode}`
  }
}

export const animateFilter = (content: string) => {
  const parsedFeed:any = convert.xml2js(content, { compact: true});
  parsedFeed.rss.channel.item = parsedFeed.rss.channel.item.map((item: any) => {
    const title = item.title._text;
    const metaParser = new AnimateTitleMetaParser(title);
    if (metaParser.isSeasonPack) return null;
    if (metaParser.isTraditionalChinese) return null;
   return item;
  })
  .filter((i: any) => i !== null)

  parsedFeed.rss.channel.item = parsedFeed.rss.channel.item
  .filter((item: any) => {
    // 过滤相同视频最高分辨率
    const itemMeta = new AnimateTitleMetaParser(item.title._text);
    const isExistHigherResolution = (parsedFeed.rss.channel.item as any[]).findIndex(i => {
      const title = i.title._text;
      const metaParser = new AnimateTitleMetaParser(title);
      if (metaParser.videoId === itemMeta.videoId) {
        if (IResolutionPriority[metaParser.resolution] > IResolutionPriority[itemMeta.resolution]) {
          return true;
        }
      }
      return false;
    });
    if (isExistHigherResolution !== -1) return null;
    return item;
  })
  .filter((i: any) => i !== null)

  return convert.js2xml(parsedFeed, {compact: true, spaces: 4});
}