/* =========================================================================
 * 吴文博 · 设计作品集 — 全站唯一内容源
 * -------------------------------------------------------------------------
 * 想改字、换图、加项目：可以直接改这个文件，也可以打开 editor.html，
 * 或任意页面加 ?edit=1 在网页上直接改。
 * 每个项目结构：
 *   id       英文短名（用于链接 #/work/xxx，不要重复）
 *   part     所属板块 id（对应 parts 数组）
 *   title    中文标题      en       英文标题（大写）
 *   year     年份          tools    使用工具
 *   role     承担角色      size     尺寸 / 载体（可留空）
 *   tagline  一句话主张    summary  导语，1—2 句
 *   note     补充说明（练习作品的来源标注），不需要就留空字符串
 *   blocks   详情页分段说明，k 为小标题，v 为正文
 *   images   作品图，src 支持 assets/ 相对路径或 data: 图片
 * ========================================================================= */

window.SITE_CONTENT = {
  "site": {
    "name": "吴文博",
    "nameEn": "WU WENBO",
    "role": "艺术与科技 · 2027 届",
    "school": "景德镇陶瓷大学 设计艺术学院",
    "intent": "求职方向：视觉设计 / 信息设计 / 品牌宣传",
    "title": "吴文博 · 设计作品集 2023—2027",
    "desc": "吴文博设计作品集：信息与图形、环境与空间、交互与影像三类共 11 组作品。景德镇陶瓷大学艺术与科技专业，2027 届。",
    "heroLines": [
      "VISUAL",
      "DESIGN",
      "PORTFOLIO"
    ],
    "metaTags": [
      "ART & TECHNOLOGY",
      "JINGDEZHEN CERAMIC UNIVERSITY",
      "INFO / SPACE / INTERACTION"
    ],
    "scrollLabel": "SCROLL TO EXPLORE ↓",
    "lede": "你好，我是吴文博，景德镇陶瓷大学艺术与科技专业 2027 届。这份作品集收了三类活：把制度与纹样翻译成可扫读的图形、把场地走成能站进去的尺度、把传统题材做成会回应的交互。共 11 组。",
    "indexLabel": "INDEX / 作品分类",
    "selectedTitle": "SELECTED<br>IMAGES",
    "selectedNote": "五组作品的代表画面。点击任意画面进入对应项目。",
    "collageIds": [
      "keju",
      "jieqi",
      "xiangcun",
      "qinghua",
      "qianli"
    ],
    "dividerId": "xiangcun",
    "featuredTitle": "FEATURED<br>WORKS",
    "featuredNote": "按项目顺序排列。每个项目都有独立详情页，含完整作品图与设计动作说明。",
    "aboutLabel": "ABOUT / 关于",
    "aboutTitle": "把设计当作<br>一种翻译。",
    "aboutText1": "制度、纹样、天气、村落——这些东西本身不是视觉的，但它们都有结构。我的工作是把结构找出来，再决定用什么形式让人一眼看懂。",
    "aboutText2": "所以这本册子里既有信息图，也有展板和投影装置。看起来跨了三个门类，做的其实是同一件事：为一个具体的议题，找到能被使用、也能被核对的视觉形式。",
    "contactLabel": "CONTACT / 联系",
    "closingTitle": "THANKS",
    "closingText": "未 来 无 限 可 能",
    "closingNote": "景德镇陶瓷大学设计艺术学院 · 艺术与科技 · 2027 届"
  },
  "contact": {
    "name": "吴文博 / WU WENBO",
    "tel": "15170699930",
    "email": "3405253257@qq.com",
    "wechat": "",
    "city": "江西 · 景德镇",
    "source": "作品集 2026 · 17 页 · 11 组作品"
  },
  "about": {
    "portrait": "",
    "intro": "2004 年生，江西人。在景德镇读艺术与科技，学会了三件事：把知识拆成结构、把结构排成版面、把版面变成能动的东西。",
    "facts": [
      {
        "k": "教育",
        "v": "景德镇陶瓷大学 · 设计艺术学院\n艺术与科技 / 本科 · 2023.09—2027.06"
      },
      {
        "k": "方向",
        "v": "视觉设计 / 信息设计 / 品牌宣传"
      },
      {
        "k": "课程",
        "v": "信息图形化设计、信息图表设计、内容与图解、空间叙事基础、数字设计（智能媒介与交互）、AI 艺术表现"
      },
      {
        "k": "工具",
        "v": "Illustrator · Photoshop · CorelDRAW · After Effects · 剪映 · CAD · 3ds Max · TouchDesigner"
      }
    ],
    "timeline": [
      {
        "y": "2025",
        "t": "信息与图形",
        "d": "科举制度信息图、纹样谱系、节气海报与气象信息图。这一年主要在练「怎么把非视觉的知识排成秩序」。"
      },
      {
        "y": "2025",
        "t": "环境与空间",
        "d": "乡村空间构想与公园集装箱咖啡厅。从一张场地平面走到人能站进去的尺度。"
      },
      {
        "y": "2026",
        "t": "交互与影像",
        "d": "青花短片、冠冕表盘、新干青铜标志、千里江山生成式交互与投影装置。开始让作品对环境有反应。"
      }
    ]
  },
  "parts": [
    {
      "id": "info",
      "label": "信息与图形",
      "en": "INFORMATION & GRAPHIC",
      "desc": "把非视觉的知识翻译成可扫读的图形秩序。",
      "range": "P01 — P04"
    },
    {
      "id": "space",
      "label": "环境与空间",
      "en": "SPACE & ENVIRONMENT",
      "desc": "从一张场地平面，走到人能站进去的尺度。",
      "range": "P05 — P06"
    },
    {
      "id": "motion",
      "label": "交互与影像",
      "en": "INTERACTION & MOTION",
      "desc": "让传统题材动起来——手势、传感、投影都是叙事的一部分。",
      "range": "P07 — P11"
    }
  ],
  "projects": [
    {
      "id": "keju",
      "part": "info",
      "title": "科举制度信息图",
      "en": "THE IMPERIAL EXAMINATION",
      "year": "2025",
      "tools": "Illustrator · Photoshop",
      "role": "信息架构 · 图形设计",
      "size": "900 × 1800 mm",
      "tagline": "把 1300 年压进一张图",
      "summary": "科举自隋创立、唐完善、宋鼎盛、明定格，至 1905 年废止。作品把这段延续最久的人才选拔制度拆成三条可扫读的线索。",
      "note": "",
      "blocks": [
        {
          "k": "文化脉络",
          "v": "科举把「读书—考试—入仕」连成一条可复制的路径，也塑造了今天的考试文化。它值得被图形化，不是因为年代长，而是因为它有清晰的结构。"
        },
        {
          "k": "设计动作",
          "v": "时间为骨：五朝等距排布，让长度可比。层级为肉：童试至殿试五级流程，让人流可见。地缘为证：各省进士数量落图，让「公平」有数据托底。三条线共用一套刻度，读者才能横向对照。"
        }
      ],
      "images": [
        {
          "src": "assets/works/keju/01.jpg",
          "w": 1344,
          "h": 1900,
          "cap": "科举制度信息图 · 全幅"
        }
      ],
      "details": [
        {
          "src": "assets/works/keju/detail-01.jpg",
          "w": 1514,
          "h": 3087,
          "of": 0,
          "box": [
            0.005,
            0.055,
            0.175,
            0.3
          ],
          "title": "GENEALOGY / 选官制度",
          "note": "西周世官制到清代科举，一条竖轴排完两千年的选人逻辑"
        },
        {
          "src": "assets/works/keju/detail-02.jpg",
          "w": 1600,
          "h": 1082,
          "of": 0,
          "box": [
            0.44,
            0.02,
            0.9,
            0.24
          ],
          "title": "TIMELINE / 朝代沿革",
          "note": "五朝等距排布，让「1300 年」这个长度变得可比"
        },
        {
          "src": "assets/works/keju/detail-03.jpg",
          "w": 1600,
          "h": 943,
          "of": 0,
          "box": [
            0.62,
            0.29,
            0.98,
            0.44
          ],
          "title": "DATA / 书院与进士",
          "note": "双轴散点，省份直接落在图上，密度自己会说话"
        }
      ]
    },
    {
      "id": "wenyang",
      "part": "info",
      "title": "中国古代纹样谱系",
      "en": "GENEALOGY OF CHINESE PATTERNS",
      "year": "2025",
      "tools": "Illustrator · Photoshop",
      "role": "信息架构 · 图形设计",
      "size": "双幅长图",
      "tagline": "纹样不只是装饰",
      "summary": "从彩陶几何纹起，经商周饕餮与云雷、战国云气、汉唐卷草花鸟，到明清吉祥图案，把「通天」「别等级」「求福」三层意思压进同一条线。",
      "note": "",
      "blocks": [
        {
          "k": "文化脉络",
          "v": "纹样通史很容易写成朝代年表——那只是把百科搬上版面。真正的问题是：同一母题为什么在不同朝代长得不一样？"
        },
        {
          "k": "设计动作",
          "v": "不做年表，改三条并行的线：形（母题如何改写）、用（换载体后发生什么）、意（语义如何下沉到民间）。三线交叉处，才是「纹样不只是装饰」的证据。"
        }
      ],
      "images": [
        {
          "src": "assets/works/wenyang/01.jpg",
          "w": 1344,
          "h": 1900,
          "cap": "纹样谱系 · 形 / 用 / 意 三线"
        },
        {
          "src": "assets/works/wenyang/02.jpg",
          "w": 1344,
          "h": 1900,
          "cap": "纹样谱系 · 母题与语义对照"
        }
      ],
      "details": [
        {
          "src": "assets/works/wenyang/detail-01.jpg",
          "w": 1193,
          "h": 992,
          "of": 0,
          "box": [
            0.02,
            0.36,
            0.36,
            0.56
          ],
          "title": "CLASS / 分类框架",
          "note": "先给定义再分类：织物、建筑、金属，读者带着框架往下看"
        },
        {
          "src": "assets/works/wenyang/detail-02.jpg",
          "w": 1600,
          "h": 1495,
          "of": 1,
          "box": [
            0.02,
            0.58,
            0.55,
            0.93
          ],
          "title": "DRAGON / 龙纹大盘",
          "note": "五千年龙纹的形态谱系，一眼看到变体关系"
        },
        {
          "src": "assets/works/wenyang/detail-03.jpg",
          "w": 1404,
          "h": 1290,
          "of": 1,
          "box": [
            0.55,
            0.04,
            0.95,
            0.3
          ],
          "title": "SHARE / 时间轮",
          "note": "扇形长度表示各期占比，把「多」变成可量"
        }
      ]
    },
    {
      "id": "jieqi",
      "part": "info",
      "title": "节气系列海报",
      "en": "SOLAR TERMS POSTER SERIES",
      "year": "2025",
      "tools": "Photoshop · Illustrator",
      "role": "视觉概念 · 版式设计",
      "size": "A3 系列",
      "tagline": "只让云与光保留温度",
      "summary": "节气不是日历，而是把天象、物候、农事绑在一起的观察系统。系列海报用同一套灰蓝语法，分别对应冰雪、雾凇、烟雨与极夜。",
      "note": "",
      "blocks": [
        {
          "k": "文化脉络",
          "v": "二十四节气的价值不在名字，而在「以象推时」——看物候定农时。要把它做成视觉，就不能只画风景。"
        },
        {
          "k": "设计动作",
          "v": "灰蓝压住画面，只让云与光保留温度。同一色阶贯穿四张，靠明度与颗粒差区分节气，使系列成立而单张可独立阅读。"
        }
      ],
      "images": [
        {
          "src": "assets/works/jieqi/01.jpg",
          "w": 1086,
          "h": 1448,
          "cap": "冰雪 · 冬"
        },
        {
          "src": "assets/works/jieqi/02.jpg",
          "w": 1086,
          "h": 1448,
          "cap": "雾凇 · 大寒"
        },
        {
          "src": "assets/works/jieqi/03.jpg",
          "w": 1086,
          "h": 1448,
          "cap": "烟雨 · 谷雨"
        },
        {
          "src": "assets/works/jieqi/04.jpg",
          "w": 844,
          "h": 1125,
          "cap": "极光 · 长夜"
        },
        {
          "src": "assets/works/jieqi/05.jpg",
          "w": 1900,
          "h": 1344,
          "cap": "系列海报墙 · 全组检视"
        }
      ],
      "details": [
        {
          "src": "assets/works/jieqi/detail-01.jpg",
          "w": 1512,
          "h": 2138,
          "of": 4,
          "box": [
            0.145,
            0.19,
            0.265,
            0.43
          ],
          "title": "PLATE 01 / 雷电",
          "note": "极端天气只留一条闪电做骨架，其余全部退让"
        },
        {
          "src": "assets/works/jieqi/detail-02.jpg",
          "w": 1512,
          "h": 2138,
          "of": 4,
          "box": [
            0.535,
            0.19,
            0.655,
            0.43
          ],
          "title": "PLATE 02 / 久旱",
          "note": "唯一允许的暖色，只占画面一角"
        },
        {
          "src": "assets/works/jieqi/detail-03.jpg",
          "w": 1512,
          "h": 2139,
          "of": 4,
          "box": [
            0.275,
            0.55,
            0.395,
            0.79
          ],
          "title": "PLATE 03 / 极寒",
          "note": "冰蓝压到最深，让极光成为唯一的光源"
        }
      ]
    },
    {
      "id": "qixiang",
      "part": "info",
      "title": "自然与气象信息图",
      "en": "ATMOSPHERE INFOGRAPHIC",
      "year": "2025",
      "tools": "Illustrator · Photoshop",
      "role": "图解设计",
      "size": "A2 双联",
      "tagline": "把经验转成可核对的坐标",
      "summary": "两种读法并置：一张解释大气环流与季风成因，一张把节气物候与现代气象数据放在同一坐标上互相校验。",
      "note": "",
      "blocks": [
        {
          "k": "两种读法",
          "v": "左图「解释型」：把大气环流、季风成因、降水机制层层拆开，用剖面与流程代替文字。右图「对照型」：节气与气象数据并置，让传统经验与现代观测互相校验。"
        },
        {
          "k": "转译方法",
          "v": "物候知识的特点是「以象推时」。信息设计要做的，是把经验转成可核对的坐标与图例——让读者能自己判断哪一句农谚还成立。"
        }
      ],
      "images": [
        {
          "src": "assets/works/qixiang/01.jpg",
          "w": 750,
          "h": 1125,
          "cap": "解释型 · 大气机制剖面"
        },
        {
          "src": "assets/works/qixiang/02.jpg",
          "w": 844,
          "h": 1125,
          "cap": "对照型 · 节气与观测数据"
        }
      ]
    },
    {
      "id": "xiangcun",
      "part": "space",
      "title": "乡村空间构想",
      "en": "RURAL SPATIAL CONCEPT",
      "year": "2025",
      "tools": "CAD · SketchUp · Photoshop",
      "role": "场地分析 · 规划 · 出图",
      "size": "3 张 A1 展板",
      "tagline": "少发明，多整理",
      "summary": "三张展板按「现状—规划—节点」推进：先记录村落既有的水口、巷道、晒场，再把这些自发形成的公共空间编入新的路网与院落体系。",
      "note": "",
      "blocks": [
        {
          "k": "任务",
          "v": "为一座有存量肌理的村落做空间构想。难点不是画得好看，而是不能把村民自己长出来的空间逻辑推平重来。"
        },
        {
          "k": "我的动作",
          "v": "先做现状记录：把水口、巷道、晒场这些自发公共空间逐一定位，标出使用时间与人群。再把它们当作固定点编入新路网，最后落到宅前屋后的节点改造。"
        },
        {
          "k": "成果",
          "v": "策略是少发明、多整理。三张展板分别承担证据、系统与落地三个层次，尺度从村落收到院落。"
        }
      ],
      "images": [
        {
          "src": "assets/works/xiangcun/01.jpg",
          "w": 1344,
          "h": 1900,
          "cap": "现状 · 水口 / 巷道 / 晒场记录"
        },
        {
          "src": "assets/works/xiangcun/02.jpg",
          "w": 1344,
          "h": 1900,
          "cap": "规划 · 路网与院落体系"
        },
        {
          "src": "assets/works/xiangcun/03.jpg",
          "w": 1344,
          "h": 1900,
          "cap": "节点 · 宅前屋后改造"
        }
      ],
      "details": [
        {
          "src": "assets/works/xiangcun/detail-01.jpg",
          "w": 1509,
          "h": 1588,
          "of": 0,
          "box": [
            0.15,
            0.28,
            0.58,
            0.6
          ],
          "title": "PLAN / 核心地块",
          "note": "三角形地块被绿带包裹，边界本身就是叙事"
        },
        {
          "src": "assets/works/xiangcun/detail-02.jpg",
          "w": 912,
          "h": 1141,
          "of": 0,
          "box": [
            0.66,
            0.06,
            0.92,
            0.29
          ],
          "title": "SITE / 区位推导",
          "note": "从地球尺度一路收到村落，先说清这块地在哪"
        },
        {
          "src": "assets/works/xiangcun/detail-03.jpg",
          "w": 1600,
          "h": 1131,
          "of": 0,
          "box": [
            0.02,
            0.62,
            0.62,
            0.92
          ],
          "title": "STRATEGY / 规划策略",
          "note": "少发明、多整理：把自发空间编进路网"
        }
      ]
    },
    {
      "id": "kafeiting",
      "part": "space",
      "title": "公园集装箱咖啡厅",
      "en": "CONTAINER CAFE IN THE PARK",
      "year": "2025",
      "tools": "CAD · 3ds Max · Photoshop",
      "role": "空间构想 · 建模 · 表现",
      "size": "1 张 A1 展板",
      "tagline": "让人走进去，而不是看过去",
      "summary": "两个海运集装箱叠合：底层黑箱开大面积玻璃，嵌入厨房与休闲区；上层亮绿箱体悬挑 7 米，成为公园里的视觉锚点。",
      "note": "",
      "blocks": [
        {
          "k": "载体",
          "v": "两个海运集装箱叠合，是成本与工期约束下的选择，也是形式起点——工业箱体的尺度本身就能提供反差。"
        },
        {
          "k": "结构",
          "v": "垂直箱体作楼梯间串联两层；入口以水景栈桥过渡，让人「走进去」而不是「看过去」。"
        },
        {
          "k": "环境",
          "v": "夜间灯光从箱体格栅透出，保留工业肌理，同时不切断与树冠、草坪的视线。"
        }
      ],
      "images": [
        {
          "src": "assets/works/kafeiting/01.jpg",
          "w": 1267,
          "h": 1900,
          "cap": "集装箱双层 + 7 米悬挑 · 展板"
        }
      ],
      "details": [
        {
          "src": "assets/works/kafeiting/detail-01.jpg",
          "w": 1600,
          "h": 1062,
          "of": 0,
          "box": [
            0.0,
            0.03,
            0.52,
            0.26
          ],
          "title": "NIGHT / 夜景主图",
          "note": "悬挑箱体亮灯后，成为公园里的视觉锚点"
        },
        {
          "src": "assets/works/kafeiting/detail-02.jpg",
          "w": 1600,
          "h": 1099,
          "of": 0,
          "box": [
            0.005,
            0.6,
            0.42,
            0.79
          ],
          "title": "DATA / 客群数据",
          "note": "五种客群占比，用咖啡杯的高度编码"
        },
        {
          "src": "assets/works/kafeiting/detail-03.jpg",
          "w": 1600,
          "h": 1636,
          "of": 0,
          "box": [
            0.56,
            0.56,
            1.0,
            0.86
          ],
          "title": "INTERIOR / 效果组图",
          "note": "黑箱开大玻璃，把公园景色借进室内"
        }
      ]
    },
    {
      "id": "qinghua",
      "part": "motion",
      "title": "青花归梦",
      "en": "BLUE & WHITE DREAM",
      "year": "2025",
      "tools": "剪映 · Photoshop · After Effects",
      "role": "脚本 · 视觉 · 剪辑",
      "size": "短片 + 主视觉",
      "tagline": "用留白代替纹样堆叠",
      "summary": "青花是景德镇最熟悉也最易被符号化的语言。短片回到它的故事性：明代仕女、庭院、月色串起从「入画」到「入梦」的线。",
      "note": "",
      "blocks": [
        {
          "k": "问题",
          "v": "一提到青花，就是缠枝莲铺满画面。符号用滥之后，青花反而失去了它原本的安静。"
        },
        {
          "k": "设计动作",
          "v": "钴蓝压成两三个层次，用留白代替纹样堆叠。叙事靠仕女、庭院、月色三个意象推进，从「入画」到「入梦」，不做解说词。"
        }
      ],
      "images": [
        {
          "src": "assets/works/qinghua/01.jpg",
          "w": 1344,
          "h": 1900,
          "cap": "青花归梦 · 短片主视觉"
        }
      ],
      "details": [
        {
          "src": "assets/works/qinghua/detail-01.jpg",
          "w": 1600,
          "h": 1101,
          "of": 0,
          "box": [
            0.05,
            0.2,
            0.42,
            0.38
          ],
          "title": "TYPE / 竖排标题",
          "note": "青花归梦四字竖排，呼应卷轴的阅读顺序"
        },
        {
          "src": "assets/works/qinghua/detail-02.jpg",
          "w": 1600,
          "h": 1131,
          "of": 0,
          "box": [
            0.02,
            0.38,
            0.5,
            0.62
          ],
          "title": "CHAPTERS / 分幕叙事",
          "note": "入画—离乡—战土—归梦，四格并列"
        },
        {
          "src": "assets/works/qinghua/detail-03.jpg",
          "w": 1600,
          "h": 1422,
          "of": 0,
          "box": [
            0.62,
            0.58,
            0.97,
            0.8
          ],
          "title": "FILM / 胶片镜头",
          "note": "分镜以胶片格呈现，强调「影像」而非「插画」"
        }
      ]
    },
    {
      "id": "guanmian",
      "part": "motion",
      "title": "翎羽时序 · 大明冠冕",
      "en": "MING CROWN WATCH",
      "year": "2025",
      "tools": "Illustrator · Photoshop",
      "role": "概念 · 图形 · 配色",
      "size": "表盘 + 10 款配色",
      "tagline": "戴在头上的制度，戴在腕上的日常",
      "summary": "明代冠服以「冕」为最高礼服形制，冕板、旒、梁与纹样是严格的等级语言。作品把它拆成表圈、刻度与十款配色。",
      "note": "",
      "blocks": [
        {
          "k": "文化脉络",
          "v": "冕不是一个造型，是一套等级语法：冕板有几旒、用什么色，都对应身份，不能随便改。"
        },
        {
          "k": "设计动作",
          "v": "把「旒」降维成刻度：垂下的珠串变成表盘上的时间标记，冕板的横平结构变成表圈。十款配色取自不同品级服色，让这套制度在腕上重新可读。"
        }
      ],
      "images": [
        {
          "src": "assets/works/guanmian/01.jpg",
          "w": 1344,
          "h": 1900,
          "cap": "翎羽时序 · 表盘与配色系统"
        }
      ],
      "details": [
        {
          "src": "assets/works/guanmian/detail-01.jpg",
          "w": 1600,
          "h": 893,
          "of": 0,
          "box": [
            0.6,
            0.415,
            0.79,
            0.49
          ],
          "title": "DIAL / 表盘特写",
          "note": "旒降维成刻度，冕板的横平变成表圈"
        },
        {
          "src": "assets/works/guanmian/detail-02.jpg",
          "w": 1600,
          "h": 1099,
          "of": 0,
          "box": [
            0.03,
            0.02,
            0.38,
            0.19
          ],
          "title": "COLOR / 色彩版本",
          "note": "取不同品级服色，一套制度多种读法"
        },
        {
          "src": "assets/works/guanmian/detail-03.jpg",
          "w": 1600,
          "h": 1320,
          "of": 0,
          "box": [
            0.45,
            0.545,
            0.75,
            0.72
          ],
          "title": "HERO / 佩戴效果",
          "note": "让制度落到腕上，而不是停在展柜里"
        }
      ]
    },
    {
      "id": "qingtong",
      "part": "motion",
      "title": "新干青铜标志重构",
      "en": "XINGAN BRONZE MARK",
      "year": "2025",
      "tools": "Illustrator",
      "role": "标志设计",
      "size": "标志 + 应用",
      "tagline": "只留「目」与「角」",
      "summary": "新干大洋洲商代青铜器是江西最重要的青铜遗存，兽面、云雷纹与扉棱辨识度极高。标志只留两个识别点，使它在各尺度都成立。",
      "note": "",
      "blocks": [
        {
          "k": "素材",
          "v": "新干大洋洲商代青铜器是江西最重要的青铜遗存。兽面、云雷纹与扉棱辨识度极高，但直接搬用在大尺寸下会糊成一团。"
        },
        {
          "k": "设计动作",
          "v": "只留「目」与「角」两个识别点，去掉细密纹饰，用最少的笔画保住兽面的凝视感。缩到瓶身、门头、甚至头像尺寸都还认得出。"
        }
      ],
      "images": [
        {
          "src": "assets/works/qingtong/01.jpg",
          "w": 748,
          "h": 1125,
          "cap": "新干青铜 · 标志与应用"
        }
      ]
    },
    {
      "id": "qianli",
      "part": "motion",
      "title": "千里江山 · 生成式交互",
      "en": "GENERATIVE LANDSCAPE",
      "year": "2026",
      "tools": "TouchDesigner · 手势识别",
      "role": "概念 · 交互逻辑 · 视觉生成",
      "size": "实时交互装置",
      "tagline": "让静态的青绿山水呼吸",
      "summary": "以生成式代码重构青绿山水，把《千里江山图》的静态意境转成可呼吸的动态世界：指尖轻捏切换四季，翻掌切换昼夜。",
      "note": "",
      "blocks": [
        {
          "k": "文化",
          "v": "青绿设色本身是一套分层语法：石青在前、石绿在后、赭石托底。它天生就是分层的，这一点和粒子系统同构。"
        },
        {
          "k": "技术路径",
          "v": "把这三层写成代码里的三层粒子，颜色随光照与季节重新计算。山体轮廓保留原画走势，颗粒与密度交给实时运算。"
        },
        {
          "k": "交互",
          "v": "不戴任何设备，手势即输入：指尖轻捏切换四季，翻掌切换昼夜。动作幅度控制到最小，避免观众为了触发效果而做夸张动作。"
        }
      ],
      "images": [
        {
          "src": "assets/works/qianli/01.jpg",
          "w": 1344,
          "h": 1900,
          "cap": "千里江山 · 生成式交互界面与气候浓度"
        }
      ],
      "details": [
        {
          "src": "assets/works/qianli/detail-01.jpg",
          "w": 1509,
          "h": 1439,
          "of": 0,
          "box": [
            0.05,
            0.33,
            0.48,
            0.62
          ],
          "title": "SEASON / 四季序列",
          "note": "手势输入对应四季，一次捏合换一季"
        },
        {
          "src": "assets/works/qianli/detail-02.jpg",
          "w": 1579,
          "h": 992,
          "of": 0,
          "box": [
            0.5,
            0.2,
            0.95,
            0.4
          ],
          "title": "DAYLIGHT / 昼夜切换",
          "note": "翻掌即换昼夜，光色重新计算"
        },
        {
          "src": "assets/works/qianli/detail-03.jpg",
          "w": 1403,
          "h": 695,
          "of": 0,
          "box": [
            0.5,
            0.41,
            0.9,
            0.55
          ],
          "title": "PAIR / 四季昼夜对照",
          "note": "同一构图的昼与夜，只改光不改形"
        }
      ]
    },
    {
      "id": "touying",
      "part": "motion",
      "title": "大卫之像 · 投影装置",
      "en": "PROJECTION INSTALLATION",
      "year": "2026",
      "tools": "Arduino · TouchDesigner · MadMapper",
      "role": "交互设计 · 装置搭建",
      "size": "雕塑 + 实时投影",
      "tagline": "让雕塑跟着环境呼吸",
      "summary": "以投影为媒介，设计声音、鼠标、传感器三种交互模式：静态雕塑随环境数据实时变换光影，形成沉浸式的双向互动。",
      "note": "",
      "blocks": [
        {
          "k": "作品",
          "v": "面对的是一尊不会动的石膏像。投影把它从「被观看的对象」变成「会回应的表面」。"
        },
        {
          "k": "链路",
          "v": "Arduino 采集传感信号 → TouchDesigner 实时生成视觉 → MadMapper 完成投影映射。三层叠合，雕塑才会跟着环境「呼吸」。"
        },
        {
          "k": "原则",
          "v": "一是让交互逻辑稳定可复现，而不是只在演示时成立；二是让光影服从一条叙事节奏，而不是随机闪烁。"
        }
      ],
      "images": [
        {
          "src": "assets/works/touying/01.jpg",
          "w": 1425,
          "h": 1900,
          "cap": "投影装置 · 交互设计与效果"
        }
      ],
      "details": [
        {
          "src": "assets/works/touying/detail-01.jpg",
          "w": 1600,
          "h": 1745,
          "of": 0,
          "box": [
            0.42,
            0.04,
            0.86,
            0.4
          ],
          "title": "SUBJECT / 投影主体",
          "note": "石膏像被投影改写成一件会回应的表面"
        },
        {
          "src": "assets/works/touying/detail-02.jpg",
          "w": 1600,
          "h": 474,
          "of": 0,
          "box": [
            0.02,
            0.5,
            0.56,
            0.62
          ],
          "title": "TOOLS / 工具与亮点",
          "note": "三层链路写在明面上，让人知道它怎么跑起来"
        },
        {
          "src": "assets/works/touying/detail-03.jpg",
          "w": 1600,
          "h": 893,
          "of": 0,
          "box": [
            0.02,
            0.63,
            0.45,
            0.81
          ],
          "title": "BUILD / 技术实现",
          "note": "先保证逻辑可复现，再谈视觉效果"
        }
      ]
    }
  ]
};
