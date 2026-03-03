import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

const noticeText =
    '⚠️  IMPORTANT: IQS India follows strict ethical recruitment standards. We never charge candidates for job placements, and we do not engage in blind sourcing. Beware of fraudsters falsely claiming to represent IQS or soliciting money for placements — these are scams. Stay vigilant. To verify our identity or report suspicious activity, contact us directly at info@iqsindia.in or +(91) 7042559158. Your trust matters to us.';

const NoticeBanner: React.FC = () => {
    return (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-primary-600 dark:bg-primary-600 text-white overflow-hidden">
            <div className="flex items-center h-8">
                {/* Scrolling text */}
                <div className="flex-1 overflow-hidden relative">
                    <div className="flex animate-marquee whitespace-nowrap">
                        <span className="text-[11.5px] font-medium inline-flex items-center gap-2 px-6">
                            <AlertTriangle className="w-3 h-3 flex-shrink-0 opacity-80" />
                            {noticeText}
                        </span>
                        {/* Duplicate for seamless loop */}
                        <span className="text-[11.5px] font-medium inline-flex items-center gap-2 px-6">
                            <AlertTriangle className="w-3 h-3 flex-shrink-0 opacity-80" />
                            {noticeText}
                        </span>
                    </div>
                </div>
            </div>
            <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 38s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
};

export default NoticeBanner;
