import { Container } from "@/components/common/container";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <Container>
        <div className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} B2 MILK. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
