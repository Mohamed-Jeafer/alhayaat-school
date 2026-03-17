# Architecture Diagrams

## System Architecture (Mermaid)

```mermaid
graph TB
    subgraph "Client"
        Browser[Web Browser]
    end
    
    subgraph "Azure Cloud"
        subgraph "Frontend"
            AppService[Azure App Service<br/>Next.js 15]
            CDN[Azure CDN<br/>Static Assets]
        end
        
        subgraph "Backend Services"
            KeyVault[Azure Key Vault<br/>Secrets]
            Storage[Azure Blob Storage<br/>Resume Files]
            DB[(Azure PostgreSQL<br/>Flexible Server)]
            Insights[Application Insights<br/>Monitoring]
        end
        
        subgraph "External Services"
            Stripe[Stripe API<br/>Payments]
            Resend[Resend API<br/>Emails]
        end
    end
    
    Browser -->|HTTPS| AppService
    AppService -->|Static Assets| CDN
    AppService -->|Secrets| KeyVault
    AppService -->|File Upload| Storage
    AppService -->|SQL Queries| DB
    AppService -->|Logs/Metrics| Insights
    AppService -->|Payment Processing| Stripe
    AppService -->|Send Emails| Resend
    Stripe -->|Webhooks| AppService
    
    style AppService fill:#0078d4
    style DB fill:#336791
    style KeyVault fill:#ffd700
    style Storage fill:#00a4ef
    style Stripe fill:#635bff
    style Resend fill:#000000
```

## Component Architecture

```mermaid
graph LR
    subgraph "Layout Components"
        Nav[Navigation]
        Footer[Footer]
        Container[Container]
        Section[Section]
        Grid[Grid]
    end
    
    subgraph "UI Components"
        Button[Button]
        Hero[HeroSection]
        Card[Cards]
        Icons[Icons]
    end
    
    subgraph "Form Components"
        Form[Form]
        Input[Input]
        Select[Select]
        Upload[FileUpload]
    end
    
    subgraph "Pages"
        Home[Home Page]
        Contact[Contact Page]
        Donate[Donate Page]
        Admin[Admin Dashboard]
    end
    
    Home --> Nav
    Home --> Hero
    Home --> Card
    Home --> Footer
    
    Contact --> Nav
    Contact --> Form
    Contact --> Input
    Contact --> Footer
    
    Donate --> Nav
    Donate --> Form
    Donate --> Button
    Donate --> Footer
    
    Admin --> Nav
    Admin --> Card
    Admin --> Grid
    
    style Home fill:#e1f5ff
    style Contact fill:#e1f5ff
    style Donate fill:#e1f5ff
    style Admin fill:#ffe1e1
```

## Database Schema

```mermaid
erDiagram
    CONTACT_SUBMISSIONS {
        int id PK
        varchar name
        varchar email
        varchar phone
        text message
        timestamp created_at
    }
    
    JOB_APPLICATIONS {
        int id PK
        varchar name
        varchar email
        varchar position
        text resume_url
        timestamp created_at
    }
    
    NEWSLETTER_SUBSCRIBERS {
        int id PK
        varchar email UK
        timestamp subscribed_at
        boolean active
    }
    
    DONATIONS {
        int id PK
        decimal amount
        varchar donor_name
        varchar donor_email
        text donor_address
        varchar stripe_session_id UK
        timestamp created_at
    }
    
    USERS {
        int id PK
        varchar email UK
        text password_hash
        varchar role
        timestamp created_at
    }
    
    SESSIONS {
        int id PK
        int user_id FK
        varchar session_token UK
        timestamp expires
        timestamp created_at
    }
    
    USERS ||--o{ SESSIONS : has
```

## CI/CD Pipeline

```mermaid
graph LR
    subgraph "Developer"
        Dev[Developer<br/>Local Machine]
    end
    
    subgraph "GitHub"
        PR[Pull Request]
        Develop[develop branch]
        Main[main branch]
    end
    
    subgraph "GitHub Actions"
        CI[CI Workflow<br/>Test & Build]
        DeployDev[Deploy Dev<br/>Workflow]
        DeployProd[Deploy Prod<br/>Workflow]
    end
    
    subgraph "Azure Environments"
        DevEnv[Dev Environment]
        ProdEnv[Production Environment]
    end
    
    Dev -->|Push| PR
    PR -->|Trigger| CI
    CI -->|Pass| Develop
    Develop -->|Auto Deploy| DeployDev
    DeployDev -->|Deploy| DevEnv
    
    Develop -->|Merge| Main
    Main -->|Trigger| DeployProd
    DeployProd -->|Manual Approval| ProdEnv
    
    style CI fill:#2ea44f
    style DeployDev fill:#0969da
    style DeployProd fill:#cf222e
```

## Migration Phase Dependencies

```mermaid
graph TD
    Phase0[Phase 0: Repo & Infrastructure Setup]
    Phase1[Phase 1: Foundation & Design System]
    Phase2[Phase 2: Component Library]
    Phase3[Phase 3: Content & Static Pages]
    Phase4[Phase 4: Interactive Pages & DB]
    Phase5[Phase 5: Auth & Admin Dashboard]
    Phase6[Phase 6: Stripe Integration]
    Phase7[Phase 7: Polish & Optimization]
    Phase8[Phase 8: Testing & Deployment]
    
    Phase0 --> Phase1
    Phase1 --> Phase2
    Phase2 --> Phase3
    Phase3 --> Phase4
    Phase4 --> Phase5
    Phase5 --> Phase6
    Phase6 --> Phase7
    Phase7 --> Phase8
    
    Phase0 -.->|Parallel| Phase4
    
    style Phase0 fill:#ffd700
    style Phase1 fill:#90ee90
    style Phase2 fill:#90ee90
    style Phase3 fill:#87ceeb
    style Phase4 fill:#87ceeb
    style Phase5 fill:#dda0dd
    style Phase6 fill:#dda0dd
    style Phase7 fill:#ffa07a
    style Phase8 fill:#ff6b6b
```

---

## Graphviz DOT Format (for later rendering)

If you install Graphviz later, here are the same diagrams in DOT format:

### System Architecture (DOT)
```dot
digraph SystemArchitecture {
    rankdir=TB;
    node [shape=box, style=rounded];
    
    // Client
    Browser [label="Web Browser", shape=ellipse];
    
    // Azure Services
    subgraph cluster_azure {
        label="Azure Cloud";
        
        AppService [label="Azure App Service\nNext.js 15", fillcolor=lightblue, style=filled];
        DB [label="PostgreSQL\nFlexible Server", shape=cylinder, fillcolor=lightgray, style=filled];
        Storage [label="Blob Storage\nResumes", fillcolor=lightyellow, style=filled];
        KeyVault [label="Key Vault\nSecrets", fillcolor=gold, style=filled];
        Insights [label="Application Insights\nMonitoring", fillcolor=lightgreen, style=filled];
    }
    
    // External Services
    Stripe [label="Stripe API", fillcolor=purple, style=filled, fontcolor=white];
    Resend [label="Resend API", fillcolor=black, style=filled, fontcolor=white];
    
    // Connections
    Browser -> AppService [label="HTTPS"];
    AppService -> DB [label="SQL"];
    AppService -> Storage [label="Upload"];
    AppService -> KeyVault [label="Secrets"];
    AppService -> Insights [label="Logs"];
    AppService -> Stripe [label="Payment"];
    AppService -> Resend [label="Email"];
    Stripe -> AppService [label="Webhook", style=dashed];
}
```

### Component Hierarchy (DOT)
```dot
digraph ComponentHierarchy {
    rankdir=LR;
    node [shape=box];
    
    // Pages
    Home [label="Home Page", fillcolor=lightblue, style=filled];
    Contact [label="Contact Page", fillcolor=lightblue, style=filled];
    Donate [label="Donate Page", fillcolor=lightblue, style=filled];
    Admin [label="Admin Dashboard", fillcolor=lightcoral, style=filled];
    
    // Layout Components
    subgraph cluster_layout {
        label="Layout Components";
        Nav [label="Navigation"];
        Footer [label="Footer"];
        Container [label="Container"];
    }
    
    // UI Components
    subgraph cluster_ui {
        label="UI Components";
        Button [label="Button"];
        Hero [label="HeroSection"];
        Card [label="Card"];
    }
    
    // Form Components
    subgraph cluster_forms {
        label="Form Components"];
        Form [label="Form"];
        Input [label="Input"];
        Upload [label="FileUpload"];
    }
    
    // Relationships
    Home -> Nav;
    Home -> Hero;
    Home -> Card;
    Home -> Footer;
    
    Contact -> Nav;
    Contact -> Form;
    Contact -> Input;
    Contact -> Footer;
    
    Donate -> Nav;
    Donate -> Form;
    Donate -> Button;
    Donate -> Footer;
    
    Admin -> Nav;
    Admin -> Card;
    Admin -> Container;
}
```

---

## How to Use These Diagrams

### Mermaid Diagrams
1. **GitHub**: Paste into README.md or any .md file - renders automatically
2. **VS Code**: Install "Markdown Preview Mermaid Support" extension
3. **Online**: Use https://mermaid.live/ to render and export
4. **Documentation**: Most modern doc tools support Mermaid

### Graphviz DOT Diagrams
1. **Install Graphviz**: `winget install graphviz` or download from graphviz.org
2. **Render to PNG**: `dot -Tpng architecture.dot -o architecture.png`
3. **Render to SVG**: `dot -Tsvg architecture.dot -o architecture.svg`
4. **Render to PDF**: `dot -Tpdf architecture.dot -o architecture.pdf`

### Export Options
- PNG: For presentations and documents
- SVG: For web and scalable graphics
- PDF: For high-quality prints
- Interactive HTML: `dot -Tsvg architecture.dot | dot -Tcmapx > architecture.html`
