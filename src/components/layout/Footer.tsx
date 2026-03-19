import Image from 'next/image';
import Link from 'next/link';
import sharedData from '@/content/_shared.json';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="19"
      viewBox="0 0 12 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10.8814 0.730963L8.3481 0.726562C5.5035 0.726562 3.6654 2.42716 3.6654 5.05836V7.05486H1.1189C0.898903 7.05486 0.720703 7.21656 0.720703 7.41456V10.3076C0.720703 10.5056 0.898903 10.6662 1.1189 10.6662H3.6654V17.968C3.6654 18.166 3.8436 18.3266 4.0636 18.3266H7.3856C7.6056 18.3266 7.7838 18.166 7.7838 17.968V10.6662H10.7604C10.9804 10.6662 11.1586 10.5056 11.1586 10.3076L11.1597 7.41456C11.1591 7.36657 11.1484 7.31924 11.1283 7.27566C11.1082 7.23207 11.0792 7.19319 11.0431 7.16156C10.9656 7.09252 10.8653 7.05452 10.7615 7.05486H7.7827V5.36196C7.7827 4.54796 7.9972 4.13546 9.1731 4.13546H10.8792C11.0992 4.13546 11.2774 3.97376 11.2774 3.77576V1.08956C11.2774 0.891563 11.0992 0.730963 10.8803 0.730963H10.8814Z"
        fill="white"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8.17168 5.72098C6.75268 5.72098 5.60868 6.87599 5.60868 8.28399C5.60868 9.69199 6.76368 10.847 8.17168 10.847C9.57968 10.847 10.7347 9.69199 10.7347 8.28399C10.7347 6.87599 9.57968 5.72098 8.17168 5.72098ZM15.8717 8.28399C15.8717 7.21699 15.8717 6.17198 15.8167 5.10498C15.7617 3.87298 15.4757 2.77298 14.5737 1.88198C13.6717 0.979984 12.5827 0.693984 11.3507 0.638984C10.2837 0.583984 9.23868 0.583984 8.17168 0.583984C7.10468 0.583984 6.05968 0.583984 4.99268 0.638984C3.76068 0.693984 2.66068 0.979984 1.76968 1.88198C0.86768 2.78398 0.58168 3.87298 0.52668 5.10498C0.47168 6.17198 0.47168 7.21699 0.47168 8.28399C0.47168 9.35099 0.47168 10.396 0.52668 11.463C0.58168 12.695 0.86768 13.795 1.76968 14.686C2.67168 15.588 3.76068 15.874 4.99268 15.929C6.05968 15.984 7.10468 15.984 8.17168 15.984C9.23868 15.984 10.2837 15.984 11.3507 15.929C12.5827 15.874 13.6827 15.588 14.5737 14.686C15.4757 13.784 15.7617 12.695 15.8167 11.463C15.8827 10.407 15.8717 9.35099 15.8717 8.28399ZM8.17168 12.233C7.65268 12.2344 7.13852 12.1333 6.65875 11.9353C6.17898 11.7374 5.74307 11.4466 5.37608 11.0796C5.00909 10.7126 4.71826 10.2767 4.52032 9.79692C4.32238 9.31715 4.22123 8.80298 4.22268 8.28399C4.22268 6.09499 5.98268 4.33498 8.17168 4.33498C10.3607 4.33498 12.1207 6.09499 12.1207 8.28399C12.1207 10.473 10.3607 12.233 8.17168 12.233ZM12.2857 5.09398C11.7797 5.09398 11.3617 4.68698 11.3617 4.16998C11.3617 3.65298 11.7687 3.24598 12.2857 3.24598C12.8027 3.24598 13.2097 3.65298 13.2097 4.16998C13.2125 4.29047 13.1905 4.41025 13.1451 4.52189C13.0996 4.63353 13.0318 4.73465 12.9457 4.81898C12.8613 4.90509 12.7602 4.97295 12.6486 5.01836C12.5369 5.06377 12.4172 5.08577 12.2967 5.08298L12.2857 5.09398Z"
        fill="white"
      />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="14"
      viewBox="0 0 20 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M18.984 3.3339C18.984 3.3339 18.8052 2.07073 18.2552 1.51432C17.5586 0.783734 16.7767 0.780068 16.4182 0.737901C13.8525 0.552734 10.0043 0.552734 10.0043 0.552734H9.99607C9.99607 0.552734 6.1479 0.552734 3.58215 0.737901C3.22465 0.780985 2.44365 0.784651 1.74607 1.51432C1.19607 2.07073 1.01732 3.3339 1.01732 3.3339C1.01732 3.3339 0.833984 4.81798 0.833984 6.30115V7.69173C0.833984 9.1749 1.01732 10.659 1.01732 10.659C1.01732 10.659 1.19607 11.9222 1.74607 12.4786C2.44365 13.2092 3.3594 13.1853 3.76732 13.2623C5.23398 13.4026 10.0007 13.4466 10.0007 13.4466C10.0007 13.4466 13.8534 13.4411 16.4182 13.255C16.7767 13.2119 17.5577 13.2082 18.2552 12.4786C18.8052 11.9222 18.984 10.659 18.984 10.659C18.984 10.659 19.1673 9.17582 19.1673 7.69173V6.30115C19.1673 4.81798 18.984 3.3339 18.984 3.3339ZM8.10773 9.37748L8.10682 4.22582L13.0605 6.81082L8.10773 9.37748Z"
        fill="white"
      />
    </svg>
  );
}

function XTwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      width="17"
      height="18"
      viewBox="0 0 17 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9.81651 7.73683L15.828 0.75H14.4035L9.18492 6.8165L5.01592 0.75H0.208008L6.51101 9.92308L0.208008 17.25H1.63251L7.14351 10.8434L11.5453 17.25H16.3533L9.81651 7.73683ZM7.86584 10.0047L7.22692 9.09075L2.14584 1.82158H4.33301L8.43417 7.68825L9.07309 8.60125L14.4035 16.2261H12.2154L7.86584 10.0047Z"
        fill="white"
      />
    </svg>
  );
}

const SOCIAL_ICONS = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  Youtube: YoutubeIcon,
  Twitter: XTwitterIcon,
} as const;

type SocialPlatform = keyof typeof SOCIAL_ICONS;

export function Footer() {
  const { tagline, address, phone, email, social, quick_links, copyright, legal_links } =
    sharedData.footer;
  const { logo } = sharedData.nav;

  return (
    <footer id="site-footer" className="bg-brand-off-white-background text-brand-black" aria-label="Site footer">
        <div className="mx-auto max-w-7xl px-4 pt-[6.6875rem] pb-[3.625rem] sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">

          <div id="footer-brand" className="lg:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-3">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <span className="text-lg font-semibold">{logo.text}</span>
            </Link>
            <p className="mb-5 text-[1.125rem] leading-relaxed text-brand-black/75">{tagline}</p>

            <div id="footer-social-group" className="flex items-center gap-3">
              {social.map((item) => {
                const Icon = SOCIAL_ICONS[item.platform as SocialPlatform];
                if (!Icon) return null;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.platform}
                    className="flex h-[2.125rem] w-[2.125rem] items-center justify-center rounded-full bg-brand-green text-white transition-colors duration-300 hover:bg-brand-blue"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          <div id="footer-contact">
            <h3 className="mb-6 text-[1.125rem] font-bold text-brand-black">
              Contact
            </h3>
            <ul id="footer-contact-list" className="space-y-3">
              <li className="flex items-start gap-2 text-[1.125rem] text-brand-black/80">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 break-all transition-colors duration-300 hover:text-brand-blue"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-black/50 flex-shrink-0">
                    <path d="M19 0.5H1C0.801088 0.5 0.610322 0.579018 0.46967 0.71967C0.329018 0.860322 0.25 1.05109 0.25 1.25V14C0.25 14.3978 0.408035 14.7794 0.68934 15.0607C0.970644 15.342 1.35218 15.5 1.75 15.5H18.25C18.6478 15.5 19.0294 15.342 19.3107 15.0607C19.592 14.7794 19.75 14.3978 19.75 14V1.25C19.75 1.05109 19.671 0.860322 19.5303 0.71967C19.3897 0.579018 19.1989 0.5 19 0.5ZM10 8.48281L2.92844 2H17.0716L10 8.48281ZM7.25406 8L1.75 13.0447V2.95531L7.25406 8ZM8.36406 9.01719L9.48906 10.0531C9.62743 10.1801 9.80842 10.2506 9.99625 10.2506C10.1841 10.2506 10.3651 10.1801 10.5034 10.0531L11.6284 9.01719L17.0659 14H2.92844L8.36406 9.01719ZM12.7459 8L18.25 2.95438V13.0456L12.7459 8Z" fill="currentColor" fillOpacity="0.8" />
                  </svg>
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-[1.125rem] text-brand-black/80">
                <a href={`tel:${phone}`} className="flex items-center gap-2 transition-colors duration-300 hover:text-brand-blue">
                  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-black/50 flex-shrink-0">
                    <path d="M11.5253 1.30575C11.5508 1.21057 11.5947 1.12133 11.6547 1.04315C11.7147 0.96496 11.7894 0.899354 11.8748 0.850077C11.9601 0.8008 12.0543 0.768817 12.152 0.755956C12.2496 0.743095 12.3489 0.749608 12.4441 0.775123C13.8344 1.13789 15.103 1.86473 16.119 2.88078C17.1351 3.89684 17.8619 5.16538 18.2247 6.55575C18.2502 6.65092 18.2567 6.75018 18.2439 6.84786C18.231 6.94555 18.199 7.03974 18.1497 7.12506C18.1005 7.21039 18.0349 7.28516 17.9567 7.34512C17.8785 7.40508 17.7893 7.44904 17.6941 7.4745C17.6307 7.49114 17.5655 7.49964 17.5 7.49981C17.3347 7.49981 17.1741 7.44521 17.043 7.34451C16.912 7.2438 16.8179 7.10263 16.7753 6.94293C16.4795 5.80792 15.8863 4.77235 15.0569 3.94296C14.2275 3.11356 13.1919 2.52036 12.0569 2.2245C11.9616 2.19914 11.8723 2.15525 11.794 2.09533C11.7157 2.03542 11.65 1.96066 11.6006 1.87533C11.5513 1.79 11.5192 1.69577 11.5063 1.59803C11.4933 1.5003 11.4998 1.40098 11.5253 1.30575ZM11.3069 5.2245C12.5997 5.5695 13.4303 6.40012 13.7753 7.69293C13.8179 7.85263 13.912 7.9938 14.043 8.09451C14.1741 8.19521 14.3347 8.24981 14.5 8.24981C14.5655 8.24964 14.6307 8.24114 14.6941 8.2245C14.7893 8.19904 14.8785 8.15508 14.9567 8.09512C15.0349 8.03516 15.1005 7.96039 15.1497 7.87506C15.199 7.78974 15.231 7.69555 15.2439 7.59786C15.2567 7.50018 15.2502 7.40092 15.2247 7.30575C14.7447 5.5095 13.4903 4.25512 11.6941 3.77512C11.5019 3.72378 11.2971 3.75089 11.1249 3.85049C10.9527 3.95009 10.8271 4.11402 10.7758 4.30622C10.7244 4.49842 10.7516 4.70314 10.8512 4.87535C10.9508 5.04756 11.1147 5.17315 11.3069 5.2245ZM18.9888 14.1636C18.8216 15.4339 18.1977 16.6 17.2337 17.4439C16.2696 18.2879 15.0313 18.7521 13.75 18.7498C6.30626 18.7498 0.250008 12.6936 0.250008 5.24981C0.247712 3.96852 0.711903 2.73021 1.55588 1.76615C2.39986 0.802093 3.56592 0.178223 4.83626 0.0110603C5.1575 -0.0281639 5.4828 0.037556 5.76362 0.198409C6.04444 0.359262 6.2657 0.606621 6.39438 0.90356L8.37438 5.32387V5.33512C8.4729 5.56242 8.51359 5.81059 8.49282 6.05744C8.47204 6.3043 8.39044 6.54217 8.25532 6.74981C8.23845 6.77512 8.22063 6.79856 8.20188 6.822L6.25001 9.13575C6.9522 10.5626 8.4447 12.042 9.89032 12.7461L12.1722 10.8045C12.1946 10.7857 12.2181 10.7681 12.2425 10.752C12.45 10.6136 12.6887 10.5292 12.937 10.5062C13.1853 10.4833 13.4354 10.5227 13.6647 10.6207L13.6769 10.6264L18.0934 12.6054C18.3909 12.7337 18.6389 12.9547 18.8003 13.2356C18.9616 13.5164 19.0278 13.842 18.9888 14.1636Z" fill="currentColor" fillOpacity="0.8" />
                  </svg>
                  {phone}
                </a>
              </li>
              <li className="text-[1.125rem] leading-relaxed text-brand-black/80">{address}</li>
            </ul>
          </div>

          <div id="footer-menu">
            <h3 className="mb-6 text-[1.125rem] font-bold text-brand-black">
              Menu
            </h3>
            <ul id="footer-menu-list" className="space-y-2">
              {quick_links.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-[1.125rem] text-brand-black/80 transition-all duration-300 hover:text-brand-blue"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      <div id="footer-bottom" className="border-t border-black/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-[1.125rem] text-brand-black/55">{copyright}</p>
          <div className="flex items-center gap-4">
            {legal_links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-[1.125rem] text-brand-black/55 transition-colors duration-300 hover:text-brand-blue"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
